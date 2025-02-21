const express = require('express')
const router = express.Router()
const controller = require('../controllers/review.controller')
const { verifyRole } = require('../middlewares/verify.middleware')
const { verifyOptionalToken } = require('../helpers/jwt_service')

router.get('/', controller.index)
router.get('/detail/:id', controller.detail)
router.patch('/edit/:id', controller.edit)
router.delete('/delete/:id', controller.delete)

router.post(
  '/create',
  verifyOptionalToken(),
  controller.addReview,
)
router.post(
  '/add-comment/:id',
  verifyOptionalToken(),
  controller.addComment,
)
router.post('/add-like/:id', controller.addLike)
router.post('/dis-like/:id', controller.disLike)
router.post('/add-rating/:id', verifyOptionalToken(), controller.addRating); 
module.exports = router
