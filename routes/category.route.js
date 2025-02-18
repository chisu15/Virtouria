const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const { verifyRole } = require("../middlewares/verify.middleware");

router.get('/', controller.index);
router.get('/detail/:id', controller.detail);
router.post('/create', verifyRole('admin'), controller.create);
router.patch('/edit/:id', verifyRole('admin'), controller.edit);
router.delete('/delete/:id', verifyRole('admin'), controller.delete);
module.exports = router;
