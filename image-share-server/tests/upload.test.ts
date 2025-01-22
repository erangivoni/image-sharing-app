const path = require("path");
const fs = require("fs");

//this is the deleted file function:
const scheduleImageExpiration = (uploadDir, filename, timeout) => {
  setTimeout(() => {
    const imagePath = path.join(uploadDir, filename);
    //console.log('function imagePath', imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) {
        //console.error(`Failed to delete file: ${filename}`, err);
      } else {
        //console.log(`Image expired and deleted: ${filename}`);
      }
    });
  }, timeout);
};

describe('Image Upload Tests', () => {
  const filename = 'testfile1.txt';
  const uploadDir = path.join(__dirname, 'testUploads');
  const tagetPath = path.join(uploadDir, filename);

  beforeAll(() => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  });

  afterAll(() => {
    const files = fs.readdirSync(uploadDir);

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

  });

  it('should create a file', () => {

    //write file
    fs.writeFileSync(tagetPath, 'This is a test file.');

    // Check if the file exists
    expect(fs.existsSync(tagetPath)).toBe(true);
  });

  it('should delete the file and check after 5 seconds', () => {

    scheduleImageExpiration(uploadDir, filename, 0);

    setTimeout(()=>{
      expect(fs.existsSync(tagetPath)).toBe(false)
    }, 2500); 
   
  });
});
