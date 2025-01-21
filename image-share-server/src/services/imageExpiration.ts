import fs from 'fs';
import path from 'path';

//const uploadDir = path.join(__dirname, '..', 'uploads');

/**
 * Schedules image deletion after a given timeout.
 * @param {string} filename - The name of the file to be deleted.
 * @param {number} timeout - The time in milliseconds after which the image will be deleted.
 * @param {string} uploadDir - The base path
 */
export const scheduleImageExpiration = (uploadDir: string, filename: string, timeout: number): void => {
  setTimeout(() => {
    const imagePath = path.join(uploadDir, filename);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filename}`, err);
      } else {
        console.log(`Image expired and deleted: ${filename}`);
      }
    });
  }, timeout);
};
