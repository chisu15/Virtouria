const mongoose = require('mongoose')

const MediaFileSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
    },
    path: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    position: {
      x: {type: Number, required: false},
      y: {type: Number, required: false},
      z: {type: Number, required: false},

    },
    scale: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'MediaFile',
  },
)

const MediaFile = mongoose.model('MediaFile', MediaFileSchema)

module.exports = MediaFile
