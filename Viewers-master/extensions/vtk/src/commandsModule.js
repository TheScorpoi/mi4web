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
import presets from './presets';

const { BlendMode } = Constants;
let active;

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

  function feature3D() {
    const vistaActivada = Array.from(
      document.getElementsByClassName('vtk-viewport-handler')
    );
    vistaActivada[0].innerHTML = '';

    //Create div
    const content0 = document.createElement('div');
    content0.className = 'row';
    vistaActivada[0].appendChild(content0);

    // Create div
    const content = document.createElement('div');
    content.style.color = 'white';
    content.id = 'content';
    content0.appendChild(content);

    // Create Widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'widgetContainer';
    widgetContainer.style.position = 'absolute';
    widgetContainer.style.top = 'calc(10px + 2em)';
    widgetContainer.style.right = '5px';
    widgetContainer.style.background = 'rgba(255, 255, 255, 0.3)';
    content0.appendChild(widgetContainer);

    // Create Label for preset
    const labelContainer = document.createElement('div');
    labelContainer.id = 'labelContainer';
    labelContainer.style.position = 'absolute';
    labelContainer.style.top = '10px';
    labelContainer.style.left = '500px';
    labelContainer.style.width = '100%';
    labelContainer.style.color = 'white';
    labelContainer.style.textAlign = 'center';
    labelContainer.style.userSelect = 'none';
    labelContainer.style.cursor = 'pointer';
    content0.appendChild(labelContainer);

    ReactDOM.render(<VTKVolumeRenderingExample />, content);
  }

  function buttons(activate, hideTransferFunctions) {
    if (active) {
      let msgExit;
      let state;
      if (activate) {
        msgExit = 'Exit 2D MPR';
        state = 'visible';
      } else {
        msgExit = 'Exit 3D';
        state = 'hidden';
      }

      const toolBar = document.getElementsByClassName('ToolbarRow');

      const controller = document.createElement('div');
      controller.style.width = '200px';
      controller.className = 'controller';

      const elementp = document.createElement('p');
      elementp.innerHTML =
        '<p style="font-size: 10px; padding-top: 10px; position: absolute; top:0; left:210px; width: 100px">Transfer Function</p>';
      controller.appendChild(elementp);

      const selectList = document.createElement('select');
      selectList.id = 'selectTransferFunction';
      selectList.style.width = '190px';
      selectList.className = 'select-ohif';
      presets.forEach(element => {
        var option = document.createElement('option');
        option.value = element['id'];
        option.text = element['name'];
        selectList.appendChild(option);
      });
      controller.appendChild(selectList);

      for (let index = 2; index < toolBar[0].childElementCount - 1; index++) {
        let element = toolBar[0].children[index];
        if (index == 2 && activate && hideTransferFunctions) {
          element.innerHTML = '';
        } else if (index == 2 && !activate) {
          element.style.visibility = 'visible';
          element.innerHTML = '';
          element.className = 'toolbar-button slab-thickness';
          element.appendChild(controller);
        } else if (!activate && index == 3) {
          element.style.visibility = 'visible';
          element.addEventListener('click', feature3D);
        } else if (activate && index == 3) {
          element.style.visibility = state;
          element.removeEventListener('click', feature3D);
        } else {
          element.style.visibility = state;
        }
      }

      toolBar[0].children[1].children[1].innerText = msgExit;
      toolBar[0].children[1].addEventListener('click', event => {
        active = true;
        buttons(true, false);
      });
      const studies = document.getElementsByClassName('study-browser')[0]
        .children[0];

      for (let index = 0; index < studies.childElementCount; index++) {
        studies.children[index].children[0].addEventListener('click', event => {
          active = true;
          buttons(true, false);
        });
        document.addEventListener('drop', event => {
          active = true;
          buttons(true, false);
        });
      }
      active = false;
    }
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
        active = true;
        buttons(true, true);
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
        active = true;
        buttons(false, false);
      } catch (error) {
        throw new Error(error);
      }
      feature3D();
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

export default commandsModule;
