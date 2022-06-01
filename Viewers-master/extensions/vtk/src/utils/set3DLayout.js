/*
import setLayoutAndViewportData from './setLayoutAndViewportData.js';

export default function setMPRLayout(
  displaySet,
  viewportPropsArray,
  numRows = 1,
  numColumns = 1
) {
  return new Promise((resolve, reject) => {
    const viewports = [];
    const numViewports = numRows * numColumns;

    if (viewportPropsArray && viewportPropsArray.length !== numViewports) {
      reject(
        new Error(
          'viewportProps is supplied but its length is not equal to numViewports'
        )
      );
    }

    const viewportSpecificData = {};
    alert("Antes do for");
    for (let i = 0; i < numViewports; i++) {
      viewports.push({});
      viewportSpecificData[i] = displaySet;
      viewportSpecificData[i].plugin = 'vtk';
    }
    alert("Depois do for");

    const apis = [];
    viewports.forEach((viewport, index) => {
      apis[index] = null;
      const viewportProps = viewportPropsArray[index];
      viewports[index] = Object.assign({}, viewports[index], {
        vtk: {
          mode: 'mpr', // TODO: not used
          afterCreation: api => {
            apis[index] = api;

            if (apis.every(a => !!a)) {
              resolve(apis);
            }
          },
          ...viewportProps,
        },
      });
    });
    alert("Depois do foreach");

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


    setLayoutAndViewportData(
      {
        numRows,
        numColumns,
        viewports,
      },
      viewportSpecificData
    );
    alert("Depois do setLayoutAndViewportData");
  });
}



const SOP_INSTANCE_UID = '00080018';
const SERIES_INSTANCE_UID = '0020000E';

const client = new api.DICOMwebClient({ url });

studyInstanceUID = localStorage.getItem('StudyInstanceUID');
//alert(studyInstanceUID);
ctSeriesInstanceUID = localStorage.getItem('SeriesInstanceUID');
searchInstanceOptions = {
  studyInstanceUID,
};
studySearchOptions = {
  studyInstanceUID,
};
*/