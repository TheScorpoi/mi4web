import React from 'react';
import './UploadImg.css';
import './PDF.css';
import api from './api_save_file';

function UploadImg() {
  let url =
    'http://localhost:3003/upload/' + localStorage.getItem('StudyInstanceUID');
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
          <label className="custom-file-upload">
            <input type="file" name="image" accept="pdf/*" />
          </label>
          <input className="button-3" type="submit" value="Upload" />
        </form>
      </div>
    </>
  );
}

export default UploadImg;
