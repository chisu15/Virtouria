const mongoose = require('mongoose')
const slugify = require('slugify')

const DeviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    is_active: {
      type: Boolean,
    },
    streaming_event: {
      type: String,
    },
    activity: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'Device',
  },
)

const Device = mongoose.model('Device', DeviceSchema)

module.exports = Device
