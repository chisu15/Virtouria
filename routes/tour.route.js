const express = require("express");
const router = express.Router();
const controller = require("../controllers/tour.controller");
const { verifyRole } = require("../middlewares/verify.middleware");

router.get('/', controller.index);
router.get('/detail/:id', controller.detail);
router.post('/create', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);
module.exports = router;
