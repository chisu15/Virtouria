const Review = require('../models/review.model')
const { paginationDTO } = require('../models/default.dto')
const { addComment } = require('../services/review.service')

module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || paginationDTO.page
    const size = parseInt(req.query.size) || paginationDTO.size

    const reviewList = await Review.find({})
      .skip((page - 1) * size)
      .limit(size)

    const total = await Review.countDocuments({})
    if (reviewList.length === 0) {
      return res.json({
        code: 204,
        message: 'No review found',
      })
    }

    res.json({
      code: 200,
      message: 'Get data success',
      data: reviewList,
      pagination: {
        total: total,
        size: size,
        page: page,
      },
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params
    const review = await Review.findById(id)
    if (!review) {
      return res.json({
        code: 204,
        message: 'No review found',
      })
    }

    res.json({
      code: 200,
      message: 'Get data success',
      data: review,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    const reviewCreate = new Review({
      ...req.body,
    })
    await reviewCreate.save()

    res.json({
      code: 200,
      message: 'Create success',
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body

    const review = await Review.findById(id)
    if (!review) {
      return res.json({
        code: 204,
        message: 'No review found',
      })
    }

    const updated = await Review.findByIdAndUpdate(id, body, { new: true })
    if (!updated) {
      return res.json({
        code: 400,
        message: 'Update failed',
      })
    }

    res.json({
      code: 200,
      message: 'Update success',
      data: updated,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const review = await Review.findById(id)
    if (!review) {
      return res.json({
        code: 204,
        message: 'No review found',
      })
    }

    await review.deleteOne()

    res.json({
      code: 200,
      message: 'Delete success',
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.addReview = async (req, res) => {
  try {
    const user = req.user
    const body = req.body

    const newReview = new Review({
      rating: body.rating,
      like: 0,
      description: body.description,
      comments: { total: 0, list: [] },
      username: user ? user.username : `anonymous${Date.now()}`, 
      user_id: user ? user._id : null,
      tour_id: body.tour_id,
    })

    await newReview.save()

    res.json({
      code: 200,
      message: 'Review created successfully',
      data: newReview,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { comment } = req.body
    const user = req.user
    const result = await addComment(id, user, comment)
    if (!result.success) {
      return res.json({ code: 204, message: result.message })
    }

    res.json({
      code: 200,
      message: 'Comment added successfully',
      data: result.comment,
    })
  } catch (error) {
    res.json({ code: 400, error: error.message })
  }
}

module.exports.addLike = async (req, res) => {
  try {
    const { id } = req.params

    const review = await Review.findById(id)
    if (!review) {
      return res.json({
        code: 204,
        message: 'No review found',
      })
    }

    review.like += 1
    await review.save()

    res.json({
      code: 200,
      message: 'Like added successfully',
      totalLikes: review.like,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.disLike = async (req, res) => {
    try {
      const { id } = req.params
  
      const review = await Review.findById(id)
      if (!review) {
        return res.json({
          code: 204,
          message: 'No review found',
        })
      }
      if (review.like > 0){
          review.like -= 1
      }
      await review.save()
  
      res.json({
        code: 200,
        message: 'Like added successfully',
        totalLikes: review.like,
      })
    } catch (error) {
      res.json({
        code: 400,
        error: error.message,
      })
    }
  }

module.exports.addRating = async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({
        code: 400,
        message: 'Rating must be between 0 and 5',
      })
    }

    const review = await Review.findById(id)
    if (!review) {
      return res.json({
        code: 204,
        message: 'No review found',
      })
    }

    review.rating = rating
    await review.save()

    res.json({
      code: 200,
      message: 'Rating updated successfully',
      data: { id: review._id, rating: review.rating },
    })
  } catch (error) {
    res.json({ code: 400, error: error.message })
  }
}
