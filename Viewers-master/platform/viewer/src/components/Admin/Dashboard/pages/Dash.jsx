import React from 'react';
import './dash.css';

export default function Dash() {
  return (
    <div className="dash">
      <div className="dashItem">
        <span className="dashTitle">Dash1</span>
        <div className="dash1Container">
          <span className="dash1">money money</span>
          <span className="dash1Butagain">again money money</span>
        </div>
        <span className="dash1 but again2">lalallala</span>
      </div>
      
      <div className="dashItem">
        <span className="dashTitle">Dash2</span>
        <div className="dash1Container">
          <span className="dash1">money money2</span>
          <span className="dash1Butagain">again money money</span>
        </div>
        <span className="dash1 but again2">lalallala</span>
      </div>
      <div className="dashItem">
        <span className="dashTitle">Dash3</span>
        <div className="dash1Container">
          <span className="dash1">money money3</span>
          <span className="dash1Butagain">again money money</span>
        </div>
        <span className="dash1 but again2">lalallala</span>
      </div>
    </div>
  );
}
