const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./user.model')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: String,
      required: true,
    },
    comments: [
      {
        username: {
          type: String,
        },
        avatar: {
          type: String,
        },
        comment: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: User,
    },
  },
  {
    timestamps: true,
    collection: 'Review',
  },
)

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review
