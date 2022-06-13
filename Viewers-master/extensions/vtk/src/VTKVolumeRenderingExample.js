import React from 'react';
import { Component } from 'react';
import {
  getImageData,
  loadImageData,
  View3D,
  imageDataCache,
} from 'react-vtkjs-viewport';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import { api } from 'dicomweb-client';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import './initCornerstone.js';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import presets from './presets.js';
import vtkPiecewiseGaussianWidget from 'vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget';
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

window.cornerstoneWADOImageLoader = cornerstoneWADOImageLoader;
const url = 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs';
var studyInstanceUID;
var ctSeriesInstanceUID;
var searchInstanceOptions;
var labelContainer;
var selectTransferFunction;
let presetIndex = 1;
let globalDataRange = [0, 255];
let cfun = vtkColorTransferFunction.newInstance();
let ofun = vtkPiecewiseFunction.newInstance();

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

function createActorMapper(imageData) {
  const mapper = vtkVolumeMapper.newInstance();
  mapper.setInputData(imageData);

  const actor = vtkVolume.newInstance();
  actor.setMapper(mapper);

  return {
    actor,
    mapper,
  };
}

function getShiftRange(colorTransferArray) {
  // Credit to paraview-glance
  // https://github.com/Kitware/paraview-glance/blob/3fec8eeff31e9c19ad5b6bff8e7159bd745e2ba9/src/components/controls/ColorBy/script.js#L133

  // shift range is original rgb/opacity range centered around 0
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < colorTransferArray.length; i += 4) {
    min = Math.min(min, colorTransferArray[i]);
    max = Math.max(max, colorTransferArray[i]);
  }

  const center = (max - min) / 2;

  return {
    shiftRange: [-center, center],
    min,
    max,
  };
}

function applyPointsToPiecewiseFunction(points, range, pwf) {
  const width = range[1] - range[0];
  const rescaled = points.map(([x, y]) => [x * width + range[0], y]);

  pwf.removeAllPoints();
  rescaled.forEach(([x, y]) => pwf.addPoint(x, y));

  return rescaled;
}

function applyPointsToRGBFunction(points, range, cfun) {
  const width = range[1] - range[0];
  const rescaled = points.map(([x, r, g, b]) => [
    x * width + range[0],
    r,
    g,
    b,
  ]);

  cfun.removeAllPoints();
  rescaled.forEach(([x, r, g, b]) => cfun.addRGBPoint(x, r, g, b));

  return rescaled;
}

function applyPreset(actor, preset) {
  // Create color transfer function
  const colorTransferArray = preset.colorTransfer
    .split(' ')
    .splice(1)
    .map(parseFloat);

  const { shiftRange } = getShiftRange(colorTransferArray);
  let min = shiftRange[0];
  const width = shiftRange[1] - shiftRange[0];
  const normColorTransferValuePoints = [];
  for (let i = 0; i < colorTransferArray.length; i += 4) {
    let value = colorTransferArray[i];
    const r = colorTransferArray[i + 1];
    const g = colorTransferArray[i + 2];
    const b = colorTransferArray[i + 3];

    value = (value - min) / width;
    normColorTransferValuePoints.push([value, r, g, b]);
  }

  applyPointsToRGBFunction(normColorTransferValuePoints, shiftRange, cfun);

  actor.getProperty().setRGBTransferFunction(0, cfun);

  // Create scalar opacity function
  const scalarOpacityArray = preset.scalarOpacity
    .split(' ')
    .splice(1)
    .map(parseFloat);

  const normPoints = [];
  for (let i = 0; i < scalarOpacityArray.length; i += 2) {
    let value = scalarOpacityArray[i];
    const opacity = scalarOpacityArray[i + 1];

    value = (value - min) / width;

    normPoints.push([value, opacity]);
  }

  applyPointsToPiecewiseFunction(normPoints, shiftRange, ofun);

  actor.getProperty().setScalarOpacity(0, ofun);

  const [
    gradientMinValue,
    gradientMinOpacity,
    gradientMaxValue,
    gradientMaxOpacity,
  ] = preset.gradientOpacity
    .split(' ')
    .splice(1)
    .map(parseFloat);

  actor.getProperty().setUseGradientOpacity(0, true);
  actor.getProperty().setGradientOpacityMinimumValue(0, gradientMinValue);
  actor.getProperty().setGradientOpacityMinimumOpacity(0, gradientMinOpacity);
  actor.getProperty().setGradientOpacityMaximumValue(0, gradientMaxValue);
  actor.getProperty().setGradientOpacityMaximumOpacity(0, gradientMaxOpacity);

  if (preset.interpolation === '1') {
    actor.getProperty().setInterpolationTypeToFastLinear();
    //actor.getProperty().setInterpolationTypeToLinear()
  }

  const ambient = parseFloat(preset.ambient);
  //const shade = preset.shade === '1'
  const diffuse = parseFloat(preset.diffuse);
  const specular = parseFloat(preset.specular);
  const specularPower = parseFloat(preset.specularPower);

  //actor.getProperty().setShade(shade)
  actor.getProperty().setAmbient(ambient);
  actor.getProperty().setDiffuse(diffuse);
  actor.getProperty().setSpecular(specular);
  actor.getProperty().setSpecularPower(specularPower);
}

function createCT3dPipeline(imageData, ctTransferFunctionPresetId) {
  const { actor, mapper } = createActorMapper(imageData);

  const sampleDistance =
    1.2 *
    Math.sqrt(
      imageData
        .getSpacing()
        .map(v => v * v)
        .reduce((a, b) => a + b, 0)
    );

  const range = imageData
    .getPointData()
    .getScalars()
    .getRange();
  actor
    .getProperty()
    .getRGBTransferFunction(0)
    .setRange(range[0], range[1]);

  mapper.setSampleDistance(sampleDistance);

  const preset = presets.find(
    preset => preset.id === ctTransferFunctionPresetId
  );

  applyPreset(actor, preset);

  actor.getProperty().setScalarOpacityUnitDistance(0, 2.5);

  return actor;
}

function createStudyImageIds(baseUrl, studySearchOptions) {
  const SOP_INSTANCE_UID = '00080018';
  const SERIES_INSTANCE_UID = '0020000E';

  const client = new api.DICOMwebClient({ url });

  studyInstanceUID = localStorage.getItem('StudyInstanceUID');
  ctSeriesInstanceUID = localStorage.getItem('SeriesInstanceUID');
  searchInstanceOptions = {
    studyInstanceUID,
  };
  studySearchOptions = {
    studyInstanceUID,
  };

  return new Promise((resolve, reject) => {
    client.retrieveStudyMetadata(studySearchOptions).then(instances => {
      const imageIds = instances.map(metaData => {
        const imageId =
          `wadors:` +
          baseUrl +
          '/studies/' +
          studyInstanceUID +
          '/series/' +
          metaData[SERIES_INSTANCE_UID].Value[0] +
          '/instances/' +
          metaData[SOP_INSTANCE_UID].Value[0] +
          '/frames/1';

        cornerstoneWADOImageLoader.wadors.metaDataManager.add(
          imageId,
          metaData
        );

        return imageId;
      });

      resolve(imageIds);
    }, reject);
  });
}

class VTKFusionExample extends Component {
  state = {
    volumeRenderingVolumes: null,
    ctTransferFunctionPresetId: 'vtkMRMLVolumePropertyNode4',
    petColorMapId: 'hsv',
  };

  async componentDidMount() {
    labelContainer = document.getElementById('labelContainer');
    selectTransferFunction = document.getElementById('selectTransferFunction');
    const imageIdPromise = createStudyImageIds(url, searchInstanceOptions);

    this.apis = [];

    const imageIds = await imageIdPromise;
    let ctImageIds = imageIds.filter(imageId =>
      imageId.includes(ctSeriesInstanceUID)
    );
    //ctImageIds = ctImageIds.slice(0, ctImageIds.length / 2);

    const ctImageDataObject = this.loadDataset(ctImageIds, 'ctDisplaySet');

    const ctImageData = ctImageDataObject.vtkImageData;

    const dataArray = ctImageData.getPointData().getScalars();
    const dataRange = dataArray.getRange();
    globalDataRange[0] = dataRange[0];
    globalDataRange[1] = dataRange[1];
    this.changePreset();

    widget.setDataArray(dataArray.getData());
    widget.applyOpacity(ofun);
    widget.setColorTransferFunction(cfun);

    const ctVolVR = createCT3dPipeline(
      ctImageData,
      this.state.ctTransferFunctionPresetId
    );

    cfun.onModified(() => {
      widget.render();
      this.rerenderAll();
    });

    this.setState({
      volumeRenderingVolumes: [ctVolVR],
      percentComplete: 0,
    });

    widget.addGaussian(0.425, 0.5, 0.2, 0.3, 0.2);
    widget.addGaussian(0.75, 1, 0.3, 0, 0);

    widget.setContainer(document.getElementById('widgetContainer'));
    widget.bindMouseListeners();

    widget.onAnimation(start => {
      if (start) {
        Object.keys(this.apis).forEach(viewportIndex => {
          const renderWindow = this.apis[
            viewportIndex
          ].genericRenderWindow.getRenderWindow();

          renderWindow.getInteractor().requestAnimation(widget);
        });
      } else {
        Object.keys(this.apis).forEach(viewportIndex => {
          const renderWindow = this.apis[
            viewportIndex
          ].genericRenderWindow.getRenderWindow();

          renderWindow.getInteractor().cancelAnimation(widget);
        });
      }
    });

    widget.onOpacityChange(() => {
      widget.applyOpacity(ofun);

      Object.keys(this.apis).forEach(viewportIndex => {
        const renderWindow = this.apis[
          viewportIndex
        ].genericRenderWindow.getRenderWindow();

        if (!renderWindow.getInteractor().isAnimating()) {
          renderWindow.render();
        }
      });
    });

    labelContainer.addEventListener('click', event => {
      if (event.pageX < 200) {
        this.changePreset(-1);
      } else {
        this.changePreset(1);
      }
    });
  }

  changePreset(delta = 1) {
    presetIndex =
      (presetIndex + delta + vtkColorMaps.rgbPresetNames.length) %
      vtkColorMaps.rgbPresetNames.length;
    cfun.applyColorMap(
      vtkColorMaps.getPresetByName(vtkColorMaps.rgbPresetNames[presetIndex])
    );
    cfun.setMappingRange(...globalDataRange);
    cfun.updateRange();
    labelContainer.innerHTML = vtkColorMaps.rgbPresetNames[presetIndex];
  }

  saveApiReference = api => {
    this.apis = [api];
  };

  handleChangeCTTransferFunction = event => {
    const ctTransferFunctionPresetId = selectTransferFunction.value;
    const preset = presets.find(
      preset => preset.id === ctTransferFunctionPresetId
    );

    const actor = this.state.volumeRenderingVolumes[0];

    applyPreset(actor, preset);

    this.rerenderAll();

    this.setState({
      ctTransferFunctionPresetId,
    });
  };

  rerenderAll = () => {
    // Update all render windows, since the automatic re-render might not
    // happen if the viewport is not currently using the painting widget
    Object.keys(this.apis).forEach(viewportIndex => {
      const renderWindow = this.apis[
        viewportIndex
      ].genericRenderWindow.getRenderWindow();

      renderWindow.render();
    });
  };

  loadDataset(imageIds, displaySetInstanceUid) {
    //imageDataCache.clear();
    //localStorage.clear();
    const imageDataObject = getImageData(imageIds, displaySetInstanceUid);

    loadImageData(imageDataObject);

    const numberOfFrames = imageIds.length;

    const onPixelDataInsertedCallback = numberProcessed => {
      const percentComplete = Math.floor(
        (numberProcessed * 100) / numberOfFrames
      );

      if (this.state.percentComplete !== percentComplete) {
        this.setState({ percentComplete });
      }

      if (percentComplete % 20 === 0) {
        this.rerenderAll();
      }
    };

    const onAllPixelDataInsertedCallback = () => {
      this.rerenderAll();
    };

    imageDataObject.onPixelDataInserted(onPixelDataInsertedCallback);
    imageDataObject.onAllPixelDataInserted(onAllPixelDataInsertedCallback);

    return imageDataObject;
  }

  render() {
    if (!this.state.volumeRenderingVolumes) {
      return (
        <h4 style={{ color: 'white', 'margin-left': '5%' }}>Loading...</h4>
      );
    }

    const { percentComplete } = this.state;

    const progressString = `Progress: ${percentComplete}%`;

    selectTransferFunction.addEventListener(
      'change',
      this.handleChangeCTTransferFunction
    );

    const vistaActivada = Array.from(
      document.getElementsByClassName('vtk-viewport-handler')
    );

    let heightVisaActivada = (vistaActivada[0].clientHeight - 82).toString() + 'px';

    return (
      <div
        style={{
          'margin-top': '50px',
          margin: 'auto 0',
          'margin-left': '5%',
          width: '65%',
        }}
      >
        <div id="contentProgressString" className="col-xs-12">
          <h5>{progressString}</h5>
        </div>
        <hr />
        <div
          id="content3D"
          style={{
            width: '100%',
            height: heightVisaActivada,
          }}
        >
          <View3D
            volumes={this.state.volumeRenderingVolumes}
            onCreated={this.saveApiReference}
          />
        </div>
      </div>
    );
  }
}

export default VTKFusionExample;
