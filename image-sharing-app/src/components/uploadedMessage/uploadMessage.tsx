import { UploadedImageType } from '../../types/UploadedImageType';
import { toast } from "react-toastify";
import './uploadMessage.css';
import { useState } from 'react'

const UploadMessage = (props: any) => {
    const [copied, setCopied] = useState("Copy Link");
    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url).then(
            () => {
                setCopied("Link copied");
            },
            () => {
                setCopied("Copy Link");
            }
          );
    };

    if (props.error) {
        return (
            <div className='confirmation-message '>
                <div className="error-mark">
                    <h2>Error Loading file</h2>
                    <span onClick={props.onClick} className="error-icon">❌</span>
                </div>
                <button className='close-bitton' onClick={props.onClick}>close</button>
            </div>
        )
    }

    return (
        <div className='confirmation-message '>
            <h2> Image Loaded Successfully</h2>
            <div className='message-link'>
                <a href={props.image.url} target="_blank" rel="noopener noreferrer">
                    {props.image.url}
                </a>
                <button
                    className="copy-button"
                    onClick={() => handleCopy(props.image.url)}
                >
                    {copied}
                </button>
            </div>
            <div>Expires at: {new Date(props.image.expiry).toLocaleString()}</div   >
            <button className='close-bitton' onClick={props.onClick}>close</button>
        </div>
    )
}

export default UploadMessage;