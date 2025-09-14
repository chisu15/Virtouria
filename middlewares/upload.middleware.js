// const multer = require('multer')

// const storage = multer.memoryStorage()
// const upload = multer({ storage })

// module.exports = upload.array('files', 10)

const multer = require('multer');
const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, '_');
    cb(null, Date.now() + '-' + safe);
  },
});
module.exports = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 2 },
}).array('files', 10);