import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  createRef,
} from 'react';
import PropTypes from 'prop-types';

import './ViewportSeeReportForm.styl';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@ohif/ui';
import { DataGrid } from '@material-ui/data-grid';
import './ViewportSeeReportFrom.css';
import Popup from 'reactjs-popup';
import fileDownload from 'js-file-download';
import api from './api';
import axios from 'axios';
const REFRESH_VIEWPORT_TIMEOUT = 1000;

const ViewportSeeReportForm = ({
  activeViewport,
  onClose,
  updateViewportPreview,
  enableViewport,
  disableViewport,
  toggleAnnotations,
  loadImage,
  defaultSize,
  minimumSize,
  maximumSize,
}) => {
  const [t] = useTranslation('ViewportSeeReportForm');

  const [patientname, setPatientname] = useState('');
  const [processnumber, setProcessnumber] = useState('');
  const [annotations, setAnnotations] = useState('');
  const [fileType, setFileType] = useState('jpg');

  const [dimensions, setDimensions] = useState({
    width: defaultSize,
    height: defaultSize,
  });

  const [showAnnotations, setShowAnnotations] = useState(true);

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
      annotations: !annotations,
    };

    setError({ ...hasError });
  }, [dimensions, patientname, annotations, minimumSize]);

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() +
    1}/${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  const [doutor, setDoutor] = useState('');
  const [type_user, setTypeuser] = useState('');
  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setDoutor(
        localStorage
          .getItem('user')
          .replace('[', '')
          .replace(']', '')
          .replace('"', '')
          .replace('"', '')
      );
    }

    if (localStorage.getItem('type_user') !== null) {
      setTypeuser(
        localStorage
          .getItem('type_user')
          .replace('[', '')
          .replace(']', '')
          .replace('"', '')
          .replace('"', '')
      );
    }
  }, [doutor, type_user]);

  const [data, setData] = useState([]);

  var study_id = localStorage.getItem('StudyInstanceUID');
  const loadTheFuckingData = () => {
    api.get(`/get_report/${study_id}`).then(res => {
      setData(res.data);
      console.log(res.data);
    });
  };

  React.useEffect(() => {
    loadTheFuckingData();
  }, []);

  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: 'blob',
      })
      .then(res => {
        fileDownload(res.data, filename);
      });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'pdf_file',
      headerName: 'Report',
      sortable: false,
      width: 250,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: params => {
        return (
          <div className="actions">
            <button
              className="declineBtn"
              onClick={() => {
                handleDownload(
                  './../../../../public/uploads/' + params.row.pdf_file,
                  params.row.pdf_file
                );
                close();
              }}
            >
              {' '}
              Download{' '}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="userList" style={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          disableSelectionOnClick
          pageSize={6}
          getRowId={row => row.pdf_file}
        />
      </div>
    </>
  );
};

ViewportSeeReportForm.propTypes = {
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

export default ViewportSeeReportForm;
