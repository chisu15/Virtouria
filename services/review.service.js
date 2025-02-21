const Review = require('../models/review.model')

/**
 * @param {String} reviewId
 * @param {Object} user
 * @param {String} comment
 * @returns {Object}
 */
const addComment = async (reviewId, user, comment) => {
  try {
    const review = await Review.findById(reviewId)
    if (!review) {
      return { success: false, message: 'No review found' }
    }

    const newComment = {
      username: user ? user.username : `anonymous${Date.now()}`,
      avatar: user ? user.avatar : '',
      comment: comment,
      time: new Date(),
    }

    review.comments.list.push(newComment)
    review.comments.total = review.comments.list.length

    await review.save()
    return { success: true, comment: newComment }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = { addComment }
