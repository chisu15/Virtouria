const Device = require('../models/device.model')
const { paginationDTO } = require('../models/default.dto')
const fs = require('fs-extra');
const path = require('path')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const deviceList = await Device.find({})
      .skip((page - 1) * size)
      .limit(size)

    const total = await Device.countDocuments({})
    if (deviceList.length === 0) {
      return res.json({
        code: 204,
        message: 'No device found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: deviceList,
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
    const device = await Device.findById(id)
    if (!device) {
      return res.json({
        code: 204,
        message: 'No device found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: device,
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
    const deviceCreate = new Device({
      ...req.body,
    })
    await deviceCreate.save()
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
    const device = await Device.findById(id)
    if (!device) {
      return res.json({
        code: 204,
        message: 'No device found',
      })
    }
    const updated = await Device.findByIdAndUpdate(id, body)
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
    const device = await Device.findById(id)
    if (!device) {
      return res.json({
        code: 204,
        message: 'No device found',
      })
    }
    await device.deleteOne()
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
