const mongoose = require('mongoose')
const slugify = require('slugify')

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sub_title: {
      type: String,
    },
    path: {
      main: {
        type: String,
      },
      video: [
        {
          type: String,
        },
      ],
      image: [{ type: String }],
    },
    description: {
      vi: { type: String },
      en: { type: String },
      tw: { type: String },
      ger: { type: String },
    },
    slug: {
      type: String,
      slug: 'title',
      unique: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'Tour',
  },
)

// Phương thức so sánh mật khẩu
TourSchema.pre('save', async function (next) {
  let title = this.title
  if (title && typeof title === 'string') {
    this.slug = slugify(this.title, {
      lower: true,
    })
    next()
  }
})

TourSchema.pre('findOneAndUpdate', function (next) {
  let title = this._update.title
  if (title && typeof title === 'string') {
    this._update.$set.slug = slugify(title, {
      lower: true,
    })
    next()
  }
})

const Tour = mongoose.model('Tour', TourSchema)

module.exports = Tour
