const mongoose = require('mongoose')
const slugify = require('slugify')

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    intro: {
      type: String,
    },
    logo: {
      type: String,
    },
    video_list: [{
      type: String,
    }],
    streaming: {
      type: String,
    },
    username: String,
    password: String
  },
  {
    timestamps: true,
    collection: 'Event',
  },
)

const Event = mongoose.model('Event', EventSchema)

module.exports = Event
