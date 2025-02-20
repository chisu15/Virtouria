const Tour = require('../models/tour.model')
const { paginationDTO } = require('../models/default.dto')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const tourList = await Tour.find({})
      .skip((page - 1) * size)
      .limit(size)
      
    const total = await Tour.countDocuments({})
    if (tourList.length === 0) {
      return res.json({
        code: 204,
        message: 'No tour found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: tourList,
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
    const tour = await Tour.findById(id)
    if (!tour) {
      return res.json({
        code: 204,
        message: 'No tour found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: tour,
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
    const tourCreate = new Tour({
      ...req.body,
    })
    await tourCreate.save()
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
    const tour = await Tour.findById(id)
    if (!tour) {
      return res.json({
        code: 204,
        message: 'No tour found',
      })
    }
    const updated = await Tour.findByIdAndUpdate(id, body)
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
    const tour = await Tour.findById(id)
    if (!tour) {
      return res.json({
        code: 204,
        message: 'No tour found',
      })
    }
    await tour.deleteOne()
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
