window.config = {
  routerBasename: '/',
  showStudyList: true,
  servers: {
    // This is an array, but we'll only use the first entry for now
    dicomWeb: [
      {
        name: 'Orthanc',
        wadoUriRoot: 'http://172.27.150.66:8763',
        qidoRoot: 'http://172.27.150.66:8763',
        wadoRoot: 'http://172.27.150.66:8763',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        // requestOptions: {
        // undefined to use JWT + Bearer auth
        // auth: 'orthanc:orthanc',
        // },
      },
    ],
  },
};
