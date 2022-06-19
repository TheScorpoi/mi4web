import React, { useEffect, useState } from 'react';
import './UploadImg.css';
import './PDF.css';
import api from './api_save_file';

function UploadImg() {
  let url =
    'http://localhost:3003/upload/' + localStorage.getItem('StudyInstanceUID');

  const [state, setState] = useState('inicial');

  const changeToPDF = () => {
    let valoue = document.getElementById('ficheiro');
    console.log(valoue.value);
    if (valoue.value == '') {
      setState('empty');
      console.log('ESTADO DEPOIS DE CLICAR --- ' + state);
    } else {
      setState('sucess');
      console.log('ESTADO DEPOIS DE CLICAR --- SUC ' + state);
    }
  };

  return (
    <>
      <div className="diva">
        <h4>
          If you choose to upload the file, you first need to generate the pdf
          and store it in you computer.
        </h4>
        <iframe
          name="dummyframe"
          id="dummyframe"
          style={{ display: 'none' }}
        ></iframe>
        <form
          action={url}
          enctype="multipart/form-data"
          method="post"
          target="dummyframe"
        >
          <div style={{ display: 'flex', 'justify-content': 'space-between' }}>
            <label
              className="custom-file-upload"
              style={{ 'margin-right': '15px' }}
            >
              <input type="file" name="image" id="ficheiro" accept="pdf/*" />
            </label>
            {state == 'inicial' ? (
              <p></p>
            ) : (
              <div>
                {state == 'sucess' ? (
                  <p style={{ color: 'green' }}>Successful upload.</p>
                ) : (
                  <p style={{ color: 'red' }}>Upload a valid file.</p>
                )}
              </div>
            )}

            <input
              className="button-3"
              type="submit"
              value="Upload"
              onClick={() => changeToPDF()}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default UploadImg;
