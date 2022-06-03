import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import './ViewportReportForm.styl';
import { TextInput, Select, Icon } from '@ohif/ui';
import Pdf from 'react-to-pdf';
import PDF from './PDF';

const ref = React.createRef();

const FILE_TYPE_OPTIONS = [
  {
    key: 'jpg',
    value: 'jpg',
  },
  {
    key: 'png',
    value: 'png',
  },
];

const REFRESH_VIEWPORT_TIMEOUT = 1000;

const ViewportReportForm = ({
  activeViewport,
  onClose,
  updateViewportPreview,
  enableViewport,
  disableViewport,
  toggleAnnotations,
  loadImage,
  downloadBlob,
  defaultSize,
  minimumSize,
  maximumSize,
  canvasClass,
}) => {
  const [t] = useTranslation('ViewportReportForm');

  const [patientname, setPatientname] = useState('');
  const [processnumber, setProcessnumber] = useState('');
  const [annotations, setAnnotations] = useState('');
  const [fileType, setFileType] = useState('jpg');

  const [dimensions, setDimensions] = useState({
    width: defaultSize,
    height: defaultSize,
  });

  const [showAnnotations, setShowAnnotations] = useState(true);

  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectMultiplier, setAspectMultiplier] = useState({
    width: 1,
    height: 1,
  });

  const [viewportElement, setViewportElement] = useState();
  const [viewportElementDimensions, setViewportElementDimensions] = useState({
    width: defaultSize,
    height: defaultSize,
  });

  const [downloadCanvas, setDownloadCanvas] = useState({
    ref: createRef(),
    width: defaultSize,
    height: defaultSize,
  });

  const [viewportPreview, setViewportPreview] = useState({
    src: null,
    width: defaultSize,
    height: defaultSize,
  });

  const [error, setError] = useState({
    width: false,
    height: false,
    patientname: false,
    processnumber: false,
    annotations: false,
  });

  const hasError = Object.values(error).includes(true);

  const refreshViewport = useRef(null);

  const [state, setState] = useState(false);

  const changeToPDF = () => {
    setState(true);
  };

  const error_messages = {
    width: t('minWidthError'),
    height: t('minHeightError'),
    patientname: t('emptyPatientError'),
    processnumber: t('emptyProcessError'),
    annotations: t('emptyAnnotationsError'),
  };

  const renderErrorHandler = errorType => {
    if (!error[errorType]) {
      return null;
    }

    return <div className="input-error">{error_messages[errorType]}</div>;
  };

  const validSize = value => (value >= minimumSize ? value : minimumSize);
  const loadAndUpdateViewports = useCallback(async () => {
    const { width: scaledWidth, height: scaledHeight } = await loadImage(
      activeViewport,
      viewportElement,
      dimensions.width,
      dimensions.height
    );

    toggleAnnotations(showAnnotations, viewportElement);

    const scaledDimensions = {
      height: validSize(scaledHeight),
      width: validSize(scaledWidth),
    };

    setViewportElementDimensions(scaledDimensions);
    setDownloadCanvas(state => ({
      ...state,
      ...scaledDimensions,
    }));

    const {
      dataUrl,
      width: viewportElementWidth,
      height: viewportElementHeight,
    } = await updateViewportPreview(
      viewportElement,
      downloadCanvas.ref.current,
      fileType
    );

    setViewportPreview(state => ({
      ...state,
      src: dataUrl,
      width: validSize(viewportElementWidth),
      height: validSize(viewportElementHeight),
    }));
  }, [
    activeViewport,
    viewportElement,
    showAnnotations,
    loadImage,
    toggleAnnotations,
    updateViewportPreview,
    fileType,
    downloadCanvas.ref,
    minimumSize,
    maximumSize,
    viewportElementDimensions,
  ]);

  useEffect(() => {
    enableViewport(viewportElement);

    return () => {
      disableViewport(viewportElement);
    };
  }, [disableViewport, enableViewport, viewportElement]);

  useEffect(() => {
    if (refreshViewport.current !== null) {
      clearTimeout(refreshViewport.current);
    }

    refreshViewport.current = setTimeout(() => {
      refreshViewport.current = null;
      loadAndUpdateViewports();
    }, REFRESH_VIEWPORT_TIMEOUT);
  }, [
    activeViewport,
    viewportElement,
    showAnnotations,
    dimensions,
    loadImage,
    toggleAnnotations,
    updateViewportPreview,
    fileType,
    downloadCanvas.ref,
    minimumSize,
    maximumSize,
  ]);

  useEffect(() => {
    const { width, height } = dimensions;
    const hasError = {
      width: width < minimumSize,
      height: height < minimumSize,
      patientname: !patientname,
      processnumber: !processnumber,
      annotations: !annotations,
    };

    setError({ ...hasError });
  }, [dimensions, patientname, processnumber, annotations, minimumSize]);

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() +
    1}/${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  const doutor = localStorage
    .getItem('user')
    .replace('[', '')
    .replace(']', '')
    .replace('"', '')
    .replace('"', '');

  return (
    <>
      {!state ? (
        <div className="ViewportReportForm">
          <div className="title">
            Make a full report filled with annotations
          </div>

          <div className="file-info-container" data-cy="file-info-container">
            <div className="col">
              <div className="file-name">
                <TextInput
                  type="text"
                  data-cy="patient-name"
                  value={patientname}
                  onChange={event => setPatientname(event.target.value)}
                  label={t('patientname')}
                  id="patient-name"
                />
                {renderErrorHandler('patientname')}
              </div>
              <div className="file-name">
                <TextInput
                  type="text"
                  data-cy="process-number"
                  value={processnumber}
                  onChange={event => setProcessnumber(event.target.value)}
                  label={t('processnumber')}
                  id="process-number"
                />
                {renderErrorHandler('processnumber')}
              </div>
            </div>
          </div>

          <div className="file-info-container" data-cy="file-info-container">
            <div className="col">
              <div className="annotationsdiv">
                <p>{t('annotations')}</p>
                <textarea
                  id="annotationstext"
                  rows="4"
                  cols="50"
                  onChange={event => setAnnotations(event.target.value)}
                ></textarea>
                {renderErrorHandler('annotations')}
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="action-cancel">
              <button
                type="button"
                data-cy="cancel-btn"
                className="btn btn-danger"
                onClick={onClose}
              >
                {t('Buttons:Cancel')}
              </button>
            </div>
            <div className="action-save">
              <button
                disabled={hasError}
                onClick={() => changeToPDF()}
                className="btn btn-primary"
                data-cy="download-btn"
              >
                {t('Buttons:Preview of the PDF')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <PDF
            patientname={patientname}
            processnumber={processnumber}
            annotations={annotations}
            doutor={doutor}
            date={date}
          />
        </div>
      )}
    </>
  );
};

ViewportReportForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  activeViewport: PropTypes.object,
  updateViewportPreview: PropTypes.func.isRequired,
  enableViewport: PropTypes.func.isRequired,
  disableViewport: PropTypes.func.isRequired,
  toggleAnnotations: PropTypes.func.isRequired,
  loadImage: PropTypes.func.isRequired,
  downloadBlob: PropTypes.func.isRequired,
  /** A default width & height, between the minimum and maximum size */
  defaultSize: PropTypes.number.isRequired,
  minimumSize: PropTypes.number.isRequired,
  maximumSize: PropTypes.number.isRequired,
  canvasClass: PropTypes.string.isRequired,
};

export default ViewportReportForm;
