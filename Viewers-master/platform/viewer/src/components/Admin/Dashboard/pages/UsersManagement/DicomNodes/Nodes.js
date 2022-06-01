import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
import React from 'react';
import './nodes.css';
import DicomNodes from './DicomNodes';

Cytoscape.use(COSEBilkent);
export default function App() {
  const layout = { name: 'cose-bilkent' };
  return (
    <>
      <span className="titleDashboard">DICOM Nodes</span>
      <span id="greyer">
        (Click on the nodes to get information of each one)
      </span>
      <div className="nodes">
        <div className="nodesItem">
          <div style={{ display: 'flex', flex: 3 }}>
            <DicomNodes />
          </div>
        </div>
      </div>
      <div className="nodes">
        <div className="nodesItem">
          <div className="nodeTitle">DICOM Nodes Information</div>
          <div className="informations">
            <p style={{ color: 'white' }}>
              Label: <span className="info" id="label"></span>
            </p>
            <p style={{ color: 'white' }}>
              Description: <span className="info" id="description"></span>
            </p>
            <p style={{ color: 'white' }}>
              AE Title: <span className="info" id="ae_title"></span>
            </p>
            <p style={{ color: 'white' }}>
              Usage Type: <span className="info" id="usage_type"></span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
