import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadPage.css";
import { UploadedImageType } from '../types/UploadedImageType';
import UploadMessage from "../components/uploadedMessage/uploadMessage";


const serverPort = 3002;

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [expiry, setExpiry] = useState<number>(5);
  const [uploadedImages, setUploadedImages] = useState<UploadedImageType[]>([]); // Keeping track of uploaded images
  const [uploadedImage, setUploadedImage] = useState<UploadedImageType>();
  const [isModal, setIsModal] = useState(false);
  const [modalErr, setModalErr] = useState(false);


  const closeModal = () => {
    setIsModal(false);
    setModalErr(false);
  };

  const handleUpload = async () => {

    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("expiry", expiry.toString());

      const response = await axios.post(`http://localhost:${serverPort}/v1/images`, formData);
      console.log('response', response);

      const newImage = {
        url: response.data.url,
        expiry: Date.now() + expiry * 60000,
      };
      setUploadedImage(newImage);
      setIsModal(true);
    } catch (e: any) {
      console.log('e', e);
      setModalErr(e);
      console.error("Error uploading image:", e); // Log the error to the console
    }
  };


  return (
    <div className="upload-page">
      <h1>Upload Image</h1>

      <div className="input-group">
        <label htmlFor="file-upload">Select Image:</label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="expiry-time">Expiry Time (in minutes):</label>
        <input
          id="expiry-time"
          type="number"
          placeholder="Expiry time in minutes"
          value={expiry}
          onChange={(e) => setExpiry(Number(e.target.value))}
        />
      </div>

      <button  disabled={file === null} className= {` ${file===null? 'disabled': "upload-button"}`} onClick={handleUpload}>Upload</button>
      {isModal &&
        <div className={`confirmation-message modal ${isModal ? "show" : ""}`}>
          <UploadMessage image={uploadedImage} onClick={closeModal} />
        </div>}
      {modalErr &&
        <div className={`confirmation-message modal show`}>
          <UploadMessage image={uploadedImage} onClick={closeModal} error={modalErr}/>
        </div>}
    </div>
  );
};

export default UploadPage;