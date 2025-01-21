import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadPage.css";

interface UploadedImage {
  url: string;
  expiry: number;
}

const serverPort = 3002;

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [expiry, setExpiry] = useState<number>(5);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]); // Keeping track of uploaded images

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

      const newImage = {
        url: response.data.url,
        expiry: Date.now() + expiry * 60000, 
      };
      setUploadedImages((prevImages) => [...prevImages, newImage]);

      toast.success(`Upload successful! Link: ${response.data.url}`);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Error uploading image:", error); // Log the error to the console
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy link.");
      }
    );
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

      <button className="upload-button" onClick={handleUpload}>Upload</button>

      {uploadedImages.length > 0 && (
        <div className="uploaded-images-list">
          <h2>Uploaded Images</h2>
          <ul>
            {uploadedImages.map((image, index) => (
              <li key={index} className="uploaded-image-item">
                <div>
                  <a href={image.url} target="_blank" rel="noopener noreferrer">
                    {image.url}
                  </a>
                  <button
                  className="copy-button"
                  onClick={() => handleCopy(image.url)}
                >
                  Copy Link
                </button>
                </div>
                <p>Expires at: {new Date(image.expiry).toLocaleString()}</p>
              
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;