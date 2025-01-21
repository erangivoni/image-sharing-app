import multer, { StorageEngine } from "multer";
import path from "path";

export const imageStorage = (uploadDir: string):StorageEngine => multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Make the filename unique
    },
  });