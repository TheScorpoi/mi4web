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
      <div>
        <span className="titleDashboard">DICOM Nodes</span>
      </div>
      <div className="nodes">
        <div className="nodesItem">
          <div style={{ display: 'flex', flex: 3 }}>
            <DicomNodes />
          </div>
        </div>
      </div>
    </>
  );
}
