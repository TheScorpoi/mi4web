import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";
import React from 'react';
import './nodes.css';

Cytoscape.use(COSEBilkent);
export default function App() {
  const layout = { name: "cose-bilkent" };
  return (
    <><div>
      <span className="titleDashboard">DICOM Nodes</span>
    </div>
    <div className="nodes">
        <div className="nodesItem">
          <div style={{ display: "flex", flex: 3 }}>
            <CytoscapeComponent

              zoom={2}
              zoomingEnabled={false}
              layout={layout}
              elements={CytoscapeComponent.normalizeElements({
                nodes: [
                  { data: { id: "one", label: "Putas1" }, position: { x: 0, y: 0 }, style: { color: "SkyBlue" } },
                  { data: { id: "two", label: "E " }, position: { x: 100, y: 0 }, style: { color: "SkyBlue" } },
                  { data: { id: "three", label: "VINHO VERDE" }, position: { x: 100, y: 0 }, style: { color: "SkyBlue" } },
                  
                ],
                edges: [
                  {
                    data: {
                      source: "one",
                      target: "two",
                      label: "Edge from Node1 to Node2"
                    }
                  },
                  {
                    data: {
                      source: "two",
                      target: "three",
                      label: "Edge from Node2 to Node3"
                    }
                  },
                ],
              })}
              style={{ width: "100%", height: "500px", marginTop: "0px", color: "white" }} />
          </div>
        </div>

      </div></>
    
  );
}
