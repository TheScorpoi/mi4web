import React from 'react';
import throttle from 'lodash.throttle';
import {
  vtkInteractorStyleMPRWindowLevel,
  vtkInteractorStyleRotatableMPRCrosshairs,
  vtkSVGRotatableCrosshairsWidget,
  vtkInteractorStyleMPRRotate,
} from 'react-vtkjs-viewport';
import { getImageData } from 'react-vtkjs-viewport';
import { vec3 } from 'gl-matrix';
import setMPRLayout from './utils/setMPRLayout.js';
import setViewportToVTK from './utils/setViewportToVTK.js';
import Constants from 'vtk.js/Sources/Rendering/Core/VolumeMapper/Constants.js';
import OHIFVTKViewport from './OHIFVTKViewport';
import VTKVolumeRenderingExample from './VTKVolumeRenderingExample.js';
import ReactDOM from 'react-dom';

//AQUI ELIMINAR DPS
import 'vtk.js/Sources/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)

import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkPiecewiseGaussianWidget from 'vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

// Force the loading of HttpDataAccessHelper to support gzip decompression
import 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';

import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

const { BlendMode } = Constants;

const commandsModule = ({ commandsManager, servicesManager }) => {
  const { UINotificationService, LoggerService } = servicesManager.services;

  // TODO: Put this somewhere else
  let apis = {};
  let defaultVOI;

  async function _getActiveViewportVTKApi(viewports) {
    const {
      numRows,
      numColumns,
      layout,
      viewportSpecificData,
      activeViewportIndex,
    } = viewports;

    const currentData = layout.viewports[activeViewportIndex];
    if (currentData && currentData.plugin === 'vtk') {
      // TODO: I was storing/pulling this from Redux but ran into weird issues
      if (apis[activeViewportIndex]) {
        return apis[activeViewportIndex];
      }
    }

    const displaySet = viewportSpecificData[activeViewportIndex];
    let api;
    if (!api) {
      try {
        api = await setViewportToVTK(
          displaySet,
          activeViewportIndex,
          numRows,
          numColumns,
          layout,
          viewportSpecificData
        );
      } catch (error) {
        throw new Error(error);
      }
    }

    return api;
  }

  function _setView(api, sliceNormal, viewUp) {
    const renderWindow = api.genericRenderWindow.getRenderWindow();
    const istyle = renderWindow.getInteractor().getInteractorStyle();
    istyle.setSliceNormal(...sliceNormal);
    istyle.setViewUp(...viewUp);

    renderWindow.render();
  }

  function getVOIFromCornerstoneViewport() {
    const dom = commandsManager.runCommand('getActiveViewportEnabledElement');
    const cornerstoneElement = cornerstone.getEnabledElement(dom);

    if (cornerstoneElement) {
      const imageId = cornerstoneElement.image.imageId;

      const Modality = cornerstone.metaData.get('Modality', imageId);

      if (Modality !== 'PT') {
        const { windowWidth, windowCenter } = cornerstoneElement.viewport.voi;

        return {
          windowWidth,
          windowCenter,
        };
      }
    }
  }

  function setVOI(voi) {
    const { windowWidth, windowCenter } = voi;
    const lower = windowCenter - windowWidth / 2.0;
    const upper = windowCenter + windowWidth / 2.0;

    const rgbTransferFunction = apis[0].volumes[0]
      .getProperty()
      .getRGBTransferFunction(0);

    rgbTransferFunction.setRange(lower, upper);

    apis.forEach(api => {
      api.updateVOI(windowWidth, windowCenter);
    });
  }

  const _convertModelToWorldSpace = (position, vtkImageData) => {
    const indexToWorld = vtkImageData.getIndexToWorld();
    const pos = vec3.create();

    position[0] += 0.5; /* Move to the centre of the voxel. */
    position[1] += 0.5; /* Move to the centre of the voxel. */
    position[2] += 0.5; /* Move to the centre of the voxel. */

    vec3.set(pos, position[0], position[1], position[2]);
    vec3.transformMat4(pos, pos, indexToWorld);

    return pos;
  };

  const actions = {
    getVtkApis: ({ index }) => {
      return apis[index];
    },
    resetMPRView() {
      // Reset orientation
      apis.forEach(api => api.resetOrientation());

      // Reset VOI
      if (defaultVOI) setVOI(defaultVOI);

      // Reset the crosshairs
      apis[0].svgWidgets.rotatableCrosshairsWidget.resetCrosshairs(apis, 0);
    },
    axial: async ({ viewports }) => {
      const api = await _getActiveViewportVTKApi(viewports);

      apis[viewports.activeViewportIndex] = api;

      _setView(api, [0, 0, 1], [0, -1, 0]);
    },
    sagittal: async ({ viewports }) => {
      const api = await _getActiveViewportVTKApi(viewports);

      apis[viewports.activeViewportIndex] = api;

      _setView(api, [1, 0, 0], [0, 0, 1]);
    },
    coronal: async ({ viewports }) => {
      const api = await _getActiveViewportVTKApi(viewports);

      apis[viewports.activeViewportIndex] = api;

      _setView(api, [0, 1, 0], [0, 0, 1]);
    },
    requestNewSegmentation: async ({ viewports }) => {
      const allViewports = Object.values(viewports.viewportSpecificData);
      const promises = allViewports.map(async (viewport, viewportIndex) => {
        let api = apis[viewportIndex];

        if (!api) {
          api = await _getActiveViewportVTKApi(viewports);
          apis[viewportIndex] = api;
        }

        api.requestNewSegmentation();
        api.updateImage();
      });
      await Promise.all(promises);
    },
    jumpToSlice: async ({
      viewports,
      studies,
      StudyInstanceUID,
      displaySetInstanceUID,
      SOPClassUID,
      SOPInstanceUID,
      segmentNumber,
      frameIndex,
      frame,
      done = () => {},
    }) => {
      let api = apis[viewports.activeViewportIndex];

      if (!api) {
        api = await _getActiveViewportVTKApi(viewports);
        apis[viewports.activeViewportIndex] = api;
      }

      const stack = OHIFVTKViewport.getCornerstoneStack(
        studies,
        StudyInstanceUID,
        displaySetInstanceUID,
        SOPClassUID,
        SOPInstanceUID,
        frameIndex
      );

      const imageDataObject = getImageData(
        stack.imageIds,
        displaySetInstanceUID
      );

      let pixelIndex = 0;
      let x = 0;
      let y = 0;
      let count = 0;

      const rows = imageDataObject.dimensions[1];
      const cols = imageDataObject.dimensions[0];

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          // [i, j] =
          const pixel = frame.pixelData[pixelIndex];
          if (pixel === segmentNumber) {
            x += i;
            y += j;
            count++;
          }
          pixelIndex++;
        }
      }
      x /= count;
      y /= count;

      const position = [x, y, frameIndex];
      const worldPos = _convertModelToWorldSpace(
        position,
        imageDataObject.vtkImageData
      );

      api.svgWidgets.rotatableCrosshairsWidget.moveCrosshairs(worldPos, apis);
      done();
    },
    setSegmentationConfiguration: async ({
      viewports,
      globalOpacity,
      visible,
      renderOutline,
      outlineThickness,
    }) => {
      const allViewports = Object.values(viewports.viewportSpecificData);
      const promises = allViewports.map(async (viewport, viewportIndex) => {
        let api = apis[viewportIndex];

        if (!api) {
          api = await _getActiveViewportVTKApi(viewports);
          apis[viewportIndex] = api;
        }

        api.setGlobalOpacity(globalOpacity);
        api.setVisibility(visible);
        api.setOutlineThickness(outlineThickness);
        api.setOutlineRendering(renderOutline);
        api.updateImage();
      });
      await Promise.all(promises);
    },
    setSegmentConfiguration: async ({ viewports, visible, segmentNumber }) => {
      const allViewports = Object.values(viewports.viewportSpecificData);
      const promises = allViewports.map(async (viewport, viewportIndex) => {
        let api = apis[viewportIndex];

        if (!api) {
          api = await _getActiveViewportVTKApi(viewports);
          apis[viewportIndex] = api;
        }

        api.setSegmentVisibility(segmentNumber, visible);
        api.updateImage();
      });
      await Promise.all(promises);
    },
    enableRotateTool: () => {
      apis.forEach((api, apiIndex) => {
        const istyle = vtkInteractorStyleMPRRotate.newInstance();

        api.setInteractorStyle({
          istyle,
          configuration: { apis, apiIndex, uid: api.uid },
        });
      });
    },
    enableCrosshairsTool: () => {
      apis.forEach((api, apiIndex) => {
        const istyle = vtkInteractorStyleRotatableMPRCrosshairs.newInstance();

        api.setInteractorStyle({
          istyle,
          configuration: {
            apis,
            apiIndex,
            uid: api.uid,
          },
        });
      });

      const rotatableCrosshairsWidget =
        apis[0].svgWidgets.rotatableCrosshairsWidget;

      const referenceLines = rotatableCrosshairsWidget.getReferenceLines();

      // Initilise crosshairs if not initialised.
      if (!referenceLines) {
        rotatableCrosshairsWidget.resetCrosshairs(apis, 0);
      }
    },
    enableLevelTool: () => {
      function updateVOI(apis, windowWidth, windowCenter) {
        apis.forEach(api => {
          api.updateVOI(windowWidth, windowCenter);
        });
      }

      const throttledUpdateVOIs = throttle(updateVOI, 16, { trailing: true }); // ~ 60 fps

      const callbacks = {
        setOnLevelsChanged: ({ windowCenter, windowWidth }) => {
          apis.forEach(api => {
            const renderWindow = api.genericRenderWindow.getRenderWindow();

            renderWindow.render();
          });

          throttledUpdateVOIs(apis, windowWidth, windowCenter);
        },
      };

      apis.forEach((api, apiIndex) => {
        const istyle = vtkInteractorStyleMPRWindowLevel.newInstance();

        api.setInteractorStyle({
          istyle,
          callbacks,
          configuration: { apis, apiIndex, uid: api.uid },
        });
      });
    },
    setSlabThickness: ({ slabThickness }) => {
      apis.forEach(api => {
        api.setSlabThickness(slabThickness);
      });
    },
    changeSlabThickness: ({ change }) => {
      apis.forEach(api => {
        const slabThickness = Math.max(api.getSlabThickness() + change, 0.1);

        api.setSlabThickness(slabThickness);
      });
    },
    setBlendModeToComposite: () => {
      apis.forEach(api => {
        const renderWindow = api.genericRenderWindow.getRenderWindow();
        const istyle = renderWindow.getInteractor().getInteractorStyle();

        const slabThickness = api.getSlabThickness();

        const mapper = api.volumes[0].getMapper();
        if (mapper.setBlendModeToComposite) {
          mapper.setBlendModeToComposite();
        }

        if (istyle.setSlabThickness) {
          istyle.setSlabThickness(slabThickness);
        }
        renderWindow.render();
      });
    },
    setBlendModeToMaximumIntensity: () => {
      apis.forEach(api => {
        const renderWindow = api.genericRenderWindow.getRenderWindow();
        const mapper = api.volumes[0].getMapper();
        if (mapper.setBlendModeToMaximumIntensity) {
          mapper.setBlendModeToMaximumIntensity();
        }
        renderWindow.render();
      });
    },
    setBlendMode: ({ blendMode }) => {
      apis.forEach(api => {
        const renderWindow = api.genericRenderWindow.getRenderWindow();

        api.volumes[0].getMapper().setBlendMode(blendMode);

        renderWindow.render();
      });
    },
    mpr2d: async ({ viewports }) => {
      // TODO push a lot of this backdoor logic lower down to the library level.
      const displaySet =
        viewports.viewportSpecificData[viewports.activeViewportIndex];

      // Get current VOI if cornerstone viewport.
      const cornerstoneVOI = getVOIFromCornerstoneViewport();
      defaultVOI = cornerstoneVOI;

      const viewportProps = [
        {
          //Axial
          orientation: {
            sliceNormal: [0, 0, 1],
            viewUp: [0, -1, 0],
          },
        },
        {
          // Sagittal
          orientation: {
            sliceNormal: [1, 0, 0],
            viewUp: [0, 0, 1],
          },
        },
        {
          // Coronal
          orientation: {
            sliceNormal: [0, 1, 0],
            viewUp: [0, 0, 1],
          },
        },
      ];

      try {
        apis = await setMPRLayout(displaySet, viewportProps, 1, 3);
      } catch (error) {
        throw new Error(error);
      }

      if (cornerstoneVOI) {
        setVOI(cornerstoneVOI);
      }

      // Add widgets and set default interactorStyle of each viewport.
      apis.forEach((api, apiIndex) => {
        api.addSVGWidget(
          vtkSVGRotatableCrosshairsWidget.newInstance(),
          'rotatableCrosshairsWidget'
        );

        const uid = api.uid;
        const istyle = vtkInteractorStyleRotatableMPRCrosshairs.newInstance();

        api.setInteractorStyle({
          istyle,
          configuration: { apis, apiIndex, uid },
        });

        api.svgWidgets.rotatableCrosshairsWidget.setApiIndex(apiIndex);
        api.svgWidgets.rotatableCrosshairsWidget.setApis(apis);
      });

      const firstApi = apis[0];

      // Initialise crosshairs
      apis[0].svgWidgets.rotatableCrosshairsWidget.resetCrosshairs(apis, 0);

      // Check if we have full WebGL 2 support
      const openGLRenderWindow = apis[0].genericRenderWindow.getOpenGLRenderWindow();

      if (!openGLRenderWindow.getWebgl2()) {
        // Throw a warning if we don't have WebGL 2 support,
        // And the volume is too big to fit in a 2D texture

        const openGLContext = openGLRenderWindow.getContext();
        const maxTextureSizeInBytes = openGLContext.getParameter(
          openGLContext.MAX_TEXTURE_SIZE
        );

        const maxBufferLengthFloat32 =
          (maxTextureSizeInBytes * maxTextureSizeInBytes) / 4;

        const dimensions = firstApi.volumes[0]
          .getMapper()
          .getInputData()
          .getDimensions();

        const volumeLength = dimensions[0] * dimensions[1] * dimensions[2];

        if (volumeLength > maxBufferLengthFloat32) {
          const message =
            'This volume is too large to fit in WebGL 1 textures and will display incorrectly. Please use a different browser to view this data';
          LoggerService.error({ message });
          UINotificationService.show({
            title: 'Browser does not support WebGL 2',
            message,
            type: 'error',
            autoClose: false,
          });
        }
      }
    },
    command3D: async ({ viewports }) => {
      const displaySet =
        viewports.viewportSpecificData[viewports.activeViewportIndex];
      const viewportProps = [
        {
          orientation: {
            sliceNormal: [0, 0, 1],
            viewUp: [0, -1, 0],
          },
        },
      ];
      try {
        await setMPRLayout(displaySet, viewportProps, 1, 1);
        buttons(false);
      } catch (error) {
        throw new Error(error);
      }

      const vistaActivada = Array.from(
        document.getElementsByClassName('vtk-viewport-handler')
      );
      vistaActivada[0].innerHTML = '';

      //alert('commandsModule, index:' + viewports.activeViewportIndex);
      //localStorage.setItem('indice', viewports.activeViewportIndex);
      ReactDOM.render(<VTKVolumeRenderingExample />, vistaActivada[0]);
      
      const rootContainer = Array.from(
        document.getElementsByClassName('vtk-viewport-handler')
      )[0];
      const containerStyle = rootContainer ? { height: '100%' } : null;
      const urlToLoad = rootContainer
        ? rootContainer.dataset.url ||
          'https://kitware.github.io/vtk-js/data/volume/LIDC2.vti'
        : `https://kitware.github.io/vtk-js/data/volume/LIDC2.vti`;

      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0],
        rootContainer,
        containerStyle,
      });
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderWindow.getInteractor().setDesiredUpdateRate(15.0);

      // ----------------------------------------------------------------------------
      // Example code
      // ----------------------------------------------------------------------------

      const body = rootContainer || document.querySelector('body');

      // Create Widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.style.position = 'absolute';
      widgetContainer.style.top = 'calc(10px + 1em)';
      widgetContainer.style.left = '5px';
      widgetContainer.style.background = 'rgba(255, 255, 255, 0.3)';
      body.appendChild(widgetContainer);

      // Create Label for preset
      const labelContainer = document.createElement('div');
      labelContainer.style.position = 'absolute';
      labelContainer.style.top = '5px';
      labelContainer.style.left = '5px';
      labelContainer.style.width = '100%';
      labelContainer.style.color = 'white';
      labelContainer.style.textAlign = 'center';
      labelContainer.style.userSelect = 'none';
      labelContainer.style.cursor = 'pointer';
      body.appendChild(labelContainer);

      let presetIndex = 1;
      const globalDataRange = [0, 255];
      const lookupTable = vtkColorTransferFunction.newInstance();

      function changePreset(delta = 1) {
        presetIndex =
          (presetIndex + delta + vtkColorMaps.rgbPresetNames.length) %
          vtkColorMaps.rgbPresetNames.length;
        lookupTable.applyColorMap(
          vtkColorMaps.getPresetByName(vtkColorMaps.rgbPresetNames[presetIndex])
        );
        lookupTable.setMappingRange(...globalDataRange);
        lookupTable.updateRange();
        labelContainer.innerHTML = vtkColorMaps.rgbPresetNames[presetIndex];
      }

      let intervalID = null;
      function stopInterval() {
        if (intervalID !== null) {
          clearInterval(intervalID);
          intervalID = null;
        }
      }

      labelContainer.addEventListener('click', event => {
        if (event.pageX < 200) {
          stopInterval();
          changePreset(-1);
        } else {
          stopInterval();
          changePreset(1);
        }
      });

 
      // ----------------------------------------------------------------------------
      // Example code
      // ----------------------------------------------------------------------------

      const widget = vtkPiecewiseGaussianWidget.newInstance({
        numberOfBins: 256,
        size: [400, 150],
      });
      widget.updateStyle({
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        histogramColor: 'rgba(100, 100, 100, 0.5)',
        strokeColor: 'rgb(0, 0, 0)',
        activeColor: 'rgb(255, 255, 255)',
        handleColor: 'rgb(50, 150, 50)',
        buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
        buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
        buttonStrokeColor: 'rgba(0, 0, 0, 1)',
        buttonFillColor: 'rgba(255, 255, 255, 1)',
        strokeWidth: 2,
        activeStrokeWidth: 3,
        buttonStrokeWidth: 1.5,
        handleWidth: 3,
        iconSize: 20, // Can be 0 if you want to remove buttons (dblClick for (+) / rightClick for (-))
        padding: 10,
      });

      fullScreenRenderer.setResizeCallback(({ width, height }) => {
        widget.setSize(Math.min(450, width - 10), 150);
      });

      const piecewiseFunction = vtkPiecewiseFunction.newInstance();

      const actor = vtkVolume.newInstance();
      const mapper = vtkVolumeMapper.newInstance({ sampleDistance: 1.1 });
      const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

      reader.setUrl(urlToLoad).then(() => {
        reader.loadData().then(() => {
          const imageData = reader.getOutputData();
          const dataArray = imageData.getPointData().getScalars();
          const dataRange = dataArray.getRange();
          globalDataRange[0] = dataRange[0];
          globalDataRange[1] = dataRange[1];
      
          // Update Lookup table
          changePreset();
      
          // Automatic switch to next preset every 5s
          if (!rootContainer) {
            intervalID = setInterval(changePreset, 5000);
          }
      
          widget.setDataArray(dataArray.getData());
          widget.applyOpacity(piecewiseFunction);
      
          widget.setColorTransferFunction(lookupTable);
          lookupTable.onModified(() => {
            widget.render();
            renderWindow.render();
          });
      
          renderer.addVolume(actor);
          renderer.resetCamera();
          renderer.getActiveCamera().elevation(70);
          renderWindow.render();
        });
      });
      
      actor.setMapper(mapper);
      mapper.setInputConnection(reader.getOutputPort());
      
      actor.getProperty().setRGBTransferFunction(0, lookupTable);
      actor.getProperty().setScalarOpacity(0, piecewiseFunction);
      actor.getProperty().setInterpolationTypeToFastLinear();
      
      // ----------------------------------------------------------------------------
      // Default setting Piecewise function widget
      // ----------------------------------------------------------------------------
      
      widget.addGaussian(0.425, 0.5, 0.2, 0.3, 0.2);
      widget.addGaussian(0.75, 1, 0.3, 0, 0);
      
      widget.setContainer(widgetContainer);
      widget.bindMouseListeners();
      
      widget.onAnimation((start) => {
        if (start) {
          renderWindow.getInteractor().requestAnimation(widget);
        } else {
          renderWindow.getInteractor().cancelAnimation(widget);
        }
      });
      
      widget.onOpacityChange(() => {
        widget.applyOpacity(piecewiseFunction);
        if (!renderWindow.getInteractor().isAnimating()) {
          renderWindow.render();
        }
      });
      
      // ----------------------------------------------------------------------------
      // Expose variable to global namespace
      // ----------------------------------------------------------------------------
      
      global.widget = widget;
    },
  };

  window.vtkActions = actions;

  const definitions = {
    requestNewSegmentation: {
      commandFn: actions.requestNewSegmentation,
      storeContexts: ['viewports'],
      options: {},
    },
    jumpToSlice: {
      commandFn: actions.jumpToSlice,
      storeContexts: ['viewports'],
      options: {},
    },
    setSegmentationConfiguration: {
      commandFn: actions.setSegmentationConfiguration,
      storeContexts: ['viewports'],
      options: {},
    },
    setSegmentConfiguration: {
      commandFn: actions.setSegmentConfiguration,
      storeContexts: ['viewports'],
      options: {},
    },
    axial: {
      commandFn: actions.axial,
      storeContexts: ['viewports'],
      options: {},
    },
    coronal: {
      commandFn: actions.coronal,
      storeContexts: ['viewports'],
      options: {},
    },
    sagittal: {
      commandFn: actions.sagittal,
      storeContexts: ['viewports'],
      options: {},
    },
    enableRotateTool: {
      commandFn: actions.enableRotateTool,
      options: {},
    },
    enableCrosshairsTool: {
      commandFn: actions.enableCrosshairsTool,
      options: {},
    },
    enableLevelTool: {
      commandFn: actions.enableLevelTool,
      options: {},
    },
    resetMPRView: {
      commandFn: actions.resetMPRView,
      options: {},
    },
    setBlendModeToComposite: {
      commandFn: actions.setBlendModeToComposite,
      options: { blendMode: BlendMode.COMPOSITE_BLEND },
    },
    setBlendModeToMaximumIntensity: {
      commandFn: actions.setBlendModeToMaximumIntensity,
      options: { blendMode: BlendMode.MAXIMUM_INTENSITY_BLEND },
    },
    setBlendModeToMinimumIntensity: {
      commandFn: actions.setBlendMode,
      options: { blendMode: BlendMode.MINIMUM_INTENSITY_BLEND },
    },
    setBlendModeToAverageIntensity: {
      commandFn: actions.setBlendMode,
      options: { blendMode: BlendMode.AVERAGE_INTENSITY_BLEND },
    },
    setSlabThickness: {
      // TODO: How do we pass in a function argument?
      commandFn: actions.setSlabThickness,
      options: {},
    },
    increaseSlabThickness: {
      commandFn: actions.changeSlabThickness,
      options: {
        change: 3,
      },
    },
    decreaseSlabThickness: {
      commandFn: actions.changeSlabThickness,
      options: {
        change: -3,
      },
    },
    mpr2d: {
      commandFn: actions.mpr2d,
      storeContexts: ['viewports'],
      options: {},
      context: 'VIEWER',
    },
    command3D: {
      commandFn: actions.command3D,
      storeContexts: ['viewports'],
      options: {},
      context: 'VIEWER',
    },
    getVtkApiForViewportIndex: {
      commandFn: actions.getVtkApis,
      context: 'VIEWER',
    },
  };

  return {
    definitions,
    defaultContext: 'ACTIVE_VIEWPORT::VTK',
  };
};

function buttons(activate) {
  let msgExit;
  let state;
  if (activate) {
    msgExit = 'Exit 2D MPR';
    state = 'visible';
  } else {
    msgExit = 'Exit 3D';
    state = 'hidden';
  }

  const toolBar = Array.from(document.getElementsByClassName('ToolbarRow'));

  for (let index = 2; index < 7; index++) {
    let element = toolBar[0].children[index];
    element.style.visibility = state;
  }

  toolBar[0].children[1].children[1].innerText = msgExit;
  toolBar[0].children[1].addEventListener('click', event => {
    buttons(true);
  });

  console.clear();
}

export default commandsModule;
