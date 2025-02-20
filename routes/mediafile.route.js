const express = require("express");
const router = express.Router();
const controller = require("../controllers/mediafile.controller");
const { verifyRole } = require("../middlewares/verify.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

router.get('/', controller.index);
router.post('/upload', uploadMiddleware, controller.upload);
router.delete('/delete/:id', controller.delete);
module.exports = router;
