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
      x: Number,
      y: Number,
      z: Number,
    },
    scale: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: 'MediaFile',
  },
)

const MediaFile = mongoose.model('MediaFile', MediaFileSchema)

module.exports = MediaFile
