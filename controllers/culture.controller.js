const Culture = require('../models/culture.model')
const { paginationDTO } = require('../models/default.dto')
const fs = require('fs-extra');
const path = require('path')

module.exports.index = async (req, res) => {
  try{
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const cultureList = await Culture.find({})
      .skip((page - 1) * size)
      .limit(size)

    const total = await Culture.countDocuments({})
    if (cultureList.length === 0) {
      return res.json({
        code: 204,
        message: 'No culture found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: cultureList,
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
    const culture = await Culture.findById(id)
    if (!culture) {
      return res.json({
        code: 204,
        message: 'No culture found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: culture,
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
    const cultureCreate = new Culture({
      ...req.body,
    })
    await cultureCreate.save()
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
    const culture = await Culture.findById(id)
    if (!culture) {
      return res.json({
        code: 204,
        message: 'No culture found',
      })
    }
    const updated = await Culture.findByIdAndUpdate(id, body)
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
    const culture = await Culture.findById(id)
    if (!culture) {
      return res.json({
        code: 204,
        message: 'No culture found',
      })
    }
    const filesToDelete = []

    if (culture.path.main) filesToDelete.push(culture.path.main)
    if (culture.path.video.length > 0) filesToDelete.push(...culture.path.video)
    if (culture.path.image.length > 0) filesToDelete.push(...culture.path.image)

    for (const filePath of filesToDelete) {
      const absolutePath = path.join(__dirname, '..', filePath)
      if (await fs.pathExists(absolutePath)) {
        await fs.remove(absolutePath)
      }
    }
    await culture.deleteOne()
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
