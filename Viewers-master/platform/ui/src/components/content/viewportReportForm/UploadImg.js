import React from 'react';
import './UploadImg.css';
import api from './api_save_file';


function UploadImg() {
  let url = "http://localhost:3003/upload/" + localStorage.getItem('StudyInstanceUID');  
  return (
    <>
      <div className="diva">
        <h4>
          How to store image path in MySQL database using Node js - Tutsmake.com
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
          <input type="file" name="image" accept="pdf/*" />
          <input type="submit" value="Upload" />
        </form>
      </div>
    </>
  );
}

export default UploadImg;
