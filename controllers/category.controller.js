const Category = require('../models/category.model')
const { paginationDTO } = require('../models/default.dto')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const categoryList = await Category.find({})
      .skip((page - 1) * size)
      .limit(size)
    const total = await Category.countDocuments({})
    if (categoryList.length === 0) {
      return res.json({
        code: 204,
        message: 'No Category found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: categoryList,
      pagination: {
        total: total,
        size: size,
        page: page,
      },
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
      return res.json({
        code: 204,
        message: 'No Category found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: category,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    const categoryCreate = new Category({
      ...req.body,
    })
    await categoryCreate.save()
    res.json({
      code: 200,
      message: 'Create success',
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body
    const category = await Category.findById(id)
    if (!category) {
      return res.json({
        code: 204,
        message: 'No Category found',
      })
    }
    const updated = await Category.findByIdAndUpdate(id, body)
    if (updated.modifiedCount === 0) {
      return res.json({
        code: 400,
        message: 'Updated fail',
      })
    }
    res.json({
      code: 200,
      message: 'Update success',
      data: body,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
      return res.json({
        code: 204,
        message: 'No Category found',
      })
    }
    await category.deleteOne()
    res.json({
      code: 200,
      message: 'Delete success',
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}
