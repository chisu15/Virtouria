const mongoose = require('mongoose')
const Category = require('./category.model')
const slugify = require('slugify')

const CultureSchema = new mongoose.Schema(
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
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: Category,
    },
  },
  {
    timestamps: true,
    collection: 'Culture',
  },
)

// Phương thức so sánh mật khẩu
CultureSchema.pre('save', async function (next) {
  let title = this.title
  if (title && typeof title === 'string') {
    this.slug = slugify(this.title, {
      lower: true,
    })
    next()
  }
})

CultureSchema.pre('findOneAndUpdate', function (next) {
  let title = this._update.title
  if (title && typeof title === 'string') {
    this._update.$set.slug = slugify(title, {
      lower: true,
    })
    next()
  }
})

const Culture = mongoose.model('Culture', CultureSchema)

module.exports = Culture
