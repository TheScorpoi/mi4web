import React, { createRef } from 'react';
import Pdf from 'react-to-pdf';
import './PDF.css';

const ref = createRef();

const PDF = props => {
  return (
    <>
      <Pdf targetRef={ref} filename="medical_report.pdf">
        {({ toPdf }) => (
          <button
            className="button-3"
            style={{ marginBottom: '20px' }}
            onClick={toPdf}
          >
            Generate Pdf
          </button>
        )}
      </Pdf>
      <div className="clear"></div>
      <div className="post" ref={ref}>
        <div className="content">
          <div className="logo">
            <img
              src="https://scontent.fopo3-1.fna.fbcdn.net/v/t1.15752-9/280253306_1193598021380225_4176329016621586750_n.png?_nc_cat=110&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeG_KBFmXJIQo1iwYa-p95Be5ZsmqlMCevLlmyaqUwJ68solqHLS6EXe8_O57ys204WM87iViYz25RBxgnBCGzXH&_nc_ohc=VFWjBqUwzbMAX-XqUEu&_nc_ht=scontent.fopo3-1.fna&oh=03_AVJ1ylGq-poullzNduIf4WqnB9ujUzeZblsr-ipfTytUUg&oe=62BB7B87"
              width={'50%'}
              height={'200px'}
            />
          </div>
          <div className="content">
            <div className="date">{props.date}</div>
            <div className="infopatient">
              <h3>
                Utente :{' '}
                <span style={{ fontWeight: 'lighter' }}>
                  {props.patientname}
                </span>
              </h3>
              <h3>
                Nº Processo :{' '}
                <span style={{ fontWeight: 'lighter' }}>
                  {props.processnumber}
                </span>
              </h3>
            </div>

            <div className="annotations">
              <h2>Anotações</h2>
              <p>{props.annotations}</p>
            </div>

            <div className="cumprimentos">
              <h4>Com os cumprimentos do/da colega</h4>
              <br></br>
              <hr style={{ width: '200px' }}></hr>
              <h4>Dr. {props.doutor}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PDF;
