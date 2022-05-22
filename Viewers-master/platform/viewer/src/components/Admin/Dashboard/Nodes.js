import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";
import React from 'react';

Cytoscape.use(COSEBilkent);
export default function App() {
  const layout = { name: "cose-bilkent" };
  return (
    <div style={{ display: "flex", flex: 1 }}>
      <CytoscapeComponent
        
        zoom={2}
        zoomingEnabled={false}
        layout={layout}
        elements={CytoscapeComponent.normalizeElements({
          nodes: [
            { data: { id: "one", label: "Node 1" }, position: { x: 0, y: 0 } },
            { data: { id: "two", label: "Node 2" }, position: { x: 100, y: 0 } }
          ],
          edges: [
            {
              data: {
                source: "one",
                target: "two",
                label: "Edge from Node1 to Node2"
              }
            }
          ]
        })}
        style={{ width: "100%", height: "500px", marginTop: "100px" }}
      />
    </div>
  );
}
