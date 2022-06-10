import React, { createRef } from 'react';
import Pdf from 'react-to-pdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PDF.css';
import api from './api_save_file';
import axios from "axios";


const ref = createRef();

function save_pdf_db(filename) {
  api.post(`/save_pdf/${filename}`).then(res => {
    console.log(res);
  }
  );
}

// function see_pdf() {
//   axios(`http://localhost:3005/upload `, {
//         method: "GET",
//         responseType: "blob"
//         //Force to receive data in a Blob Format
//       })
//         .then(response => {
//           //Create a Blob from the PDF Stream
//           const file = new Blob([response.data], {
//             type: "application/pdf"
//           });
//           //Build a URL from the file
//           const fileURL = URL.createObjectURL(file);
//           //Open the URL on new Window
//           window.open(fileURL);
//         })
//         .catch(error => {
//           console.log(error);
//         }); 
// }

const onFileUpload = (file) => {
  const formData = new FormData();
  formData.append("myFile", document.querySelector('#post'));

  axios.post("http://localhost:3003/upload", formData); //I need to change this line
};


// function save_pdf() {
//   const input = document.getElementById('post');
//   html2canvas(input).then(canvas => {
//     const pdf = new jsPDF();
//     pdf.addText("ola testinho");
//     pdf.save('test.pdf');
//     api.post(`/save_pdf/${pdf}`).then(res => {
//       console.log(res);
//     }
//     );
//   } 
//   );
// }

const PDF = props => {
  return (
    <>
      <Pdf targetRef={ref} filename="medical_report.pdf">
        {({ toPdf }) => (
          <button
            className="button-3"
            style={{ marginBottom: '20px' }}
            onMouseOver={toPdf}
            onClick={() => onFileUpload('medical_report.pdf')}
          >
            Generate Pdf
          </button>
          
        )}
      </Pdf>
      <button
            className="button-3"
            style={{ marginBottom: '20px' }}
      >
            see Pdf
          </button>
      <div className="clear"></div>
      <div className="post">
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
                Patient :{' '}
                <span style={{ fontWeight: 'lighter' }}>
                  {props.patientname}
                </span>
              </h3>
              <h3>
                Study number :{' '}
                <span style={{ fontWeight: 'lighter' }}>
                  {localStorage.getItem('StudyInstanceUID')}
                </span>
              </h3>
            </div>

            <div className="annotations">
              <h2>Anotations</h2>
              <p>{props.annotations}</p>
            </div>

            <div className="cumprimentos">
              <h4>With the best wishes:</h4>
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
