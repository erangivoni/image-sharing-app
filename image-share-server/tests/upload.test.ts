const path = require("path");
const fs = require("fs");

// const uploadDir = path.join(__dirname, 'testUploads');
// const testImagePath = path.join(__dirname, 'halo_kity.png');
//const { scheduleImageExpiration } = require( '../src/services/imageExpiration');


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
  console.log('uploadDir', uploadDir);
  console.log('tagetPath', tagetPath);


  // beforeEach(() => {
  //   jest.useFakeTimers(); // Mock setTimeout
  // });

  // afterEach(() => {
  //   jest.runOnlyPendingTimers(); // Run any remaining timers (cleanup)
  //   jest.useRealTimers(); // Restore the real timers
  // });

  beforeAll(() => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

  });

  afterAll(() => {
    // Clean up the upload folder after 30 secs

  });

  it('should create a file', () => {

    //write file
    fs.writeFileSync(tagetPath, 'This is a test file.');

    // Check if the file exists
    expect(fs.existsSync(tagetPath)).toBe(true);
  });

  it('should delete the file and check after 5 seconds', () => {

    scheduleImageExpiration(uploadDir, filename, 10);

    setTimeout(()=>{
      expect(fs.existsSync(tagetPath)).toBe(false)
    }, 2500); 

   
  });
});
