const mongoose = require('mongoose')
const slugify = require('slugify')

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      slug: 'title',
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: 'Category',
  },
)

// Phương thức so sánh mật khẩu
CategorySchema.pre('save', async function (next) {
  let title = this.title
  if (title && typeof title === 'string') {
    this.slug = slugify(this.title, {
      lower: true,
    })
    next()
  }
})

CategorySchema.pre('findOneAndUpdate', function (next) {
  let title = this._update.title
  if (title && typeof title === 'string') {
    this._update.$set.slug = slugify(title, {
      lower: true,
    })
    next()
  }
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category
