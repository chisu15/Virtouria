const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
    },
    like: {
      type: Number,
      default: 0,
    },
    comments: {
      total: {
        type: Number,
        default: 0,
      },
      list: [
        {
          username: {
            type: String,
            required: true,
          },
          avatar: {
            type: String,
            default: '',
          },
          comment: {
            type: String,
            required: true,
          },
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    username: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tour_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'Review',
  },
)

const Review = mongoose.model('Review', ReviewSchema)
module.exports = Review
