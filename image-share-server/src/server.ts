
import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { scheduleImageExpiration } from './services/imageExpiration';
import { imageStorage } from './services/storage';


const app = express();
const PORT = 3002;


// CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = imageStorage(uploadDir);
const upload = multer({ storage: storage });

// Middleware for logging each request (successful or failed)
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Incoming Request - Method: ${method}, URL: ${url}`);
  next();
};

// Middleware for logging response status and errors
const logResponse = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  const timestamp = new Date().toISOString();

  res.send = function (this: Response<any>, body: any): Response<any> {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Response - Status: ${res.statusCode}, URL: ${req.originalUrl}`);
    return originalSend.call(this, body); // Call the original send method with the same context
  };

  next();
}

app.use(logRequest);
app.use(logResponse);

// Handle image upload
app.post("/v1/images", upload.single("image"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  try{
    const file = req.file;
    const imageUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
    const expiryTime = parseInt(req.body.expiry) || 60;
    console.log('uploaded single file', `file: ${file}`, `imageUrl: ${imageUrl}`, `expiryTime: ${expiryTime}`);
    scheduleImageExpiration(uploadDir, file.filename, expiryTime * 1000 * 60);
    res.json({ url: imageUrl });
        
  }
  catch(e: any){
    res.status(400).send({ message: "error loading file. " + e.message});
  }

});

// Serve uploaded images
app.get("/uploads/:filename", (req: Request, res: Response): void => {
  const filePath = path.join(uploadDir, req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({ message: "Image not found or expired" });
    }
    res.sendFile(filePath);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

