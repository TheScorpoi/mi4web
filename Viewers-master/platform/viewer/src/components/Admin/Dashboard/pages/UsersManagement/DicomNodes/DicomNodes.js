import React from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import COSEBilkent from 'cytoscape-cose-bilkent';

Cytoscape.use(COSEBilkent);

export default class DicomNodes extends React.Component {
  initListeners() {
    this.cy.on('tap', 'node', evt => {
      var node = evt.target;
      console.log(node.data());
      document.getElementById('label').innerHTML = node.data().label;
      document.getElementById(
        'description'
      ).innerHTML = node.data().description;
      document.getElementById('ae_title').innerHTML = node.data().ae_title;
      document.getElementById('usage_type').innerHTML = node.data().usage_type;
    });
  }
  componentWillUnmount() {
    console.log('remove listeners');
    if (this.cy) {
      this.cy.removeAllListeners();
    }
  }
  render() {
    const elements = [
      {
        data: {
          id: 'one',
          label: 'Viewer-2',
          description: 'Temos aqui o Viewer-2 muito bonito',
          ae_title: 'AETITULO 2',
          usage_type: 'Retrieve',
        },
        style: { color: 'SkyBlue', 'font-size': '10px' },
      },
      {
        data: {
          id: 'two',
          label: 'MI4WEB Server',
          type: 'comp',
          ae_title: 'AETITULO SERVER PARÇA',
          description: 'Temos aqui o SERVER que tem muitas coisas para se ver',
          usage_type: 'Both',
        },
        style: { color: 'SkyBlue', 'font-size': '10px' },
      },
      {
        data: {
          id: 'three',
          label: 'Viewer-1',
          ae_title: 'AETITULO 1',
          description: 'Temos aqui o Viewer-1 mais bonito q o viewer 2',
          usage_type: 'Retrieve',
        },
        style: { color: 'SkyBlue', 'font-size': '10px' },
      },
      {
        data: {
          source: 'one',
          target: 'two',
          label: 'Edge from Node1 to Node2',
        },
      },
      {
        data: {
          source: 'three',
          target: 'two',
          label: 'Edge from Node1 to Node2',
        },
      },
    ];

    const layout = { name: 'cose-bilkent' };

    return (
      <CytoscapeComponent
        elements={elements}
        layout={layout}
        cy={cy => {
          this.cy = cy;
          this.initListeners();
        }}
        stylesheet={[
          {
            selector: 'node',
            style: {
              'background-color': '#282',
              label: 'data(label)',
              //opacity: 0.3
            },
          },
          {
            selector: 'node[type="comp"]',
            style: {
              'background-color': '#822',
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#ffffff',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            },
          },
        ]}
        style={{
          width: '300px',
          height: '600px',
          display: 'flex',
          flex: 3,
        }}
      />
    );
  }
}
