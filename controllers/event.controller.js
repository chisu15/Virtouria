const Event = require('../models/event.model')
const { paginationDTO } = require('../models/default.dto')
const fs = require('fs-extra');
const path = require('path')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const eventList = await Event.find({})
      .skip((page - 1) * size)
      .limit(size)

    const total = await Event.countDocuments({})
    if (eventList.length === 0) {
      return res.json({
        code: 204,
        message: 'No Event found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: eventList,
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
    const event = await Event.findById(id)
    if (!event) {
      return res.json({
        code: 204,
        message: 'No Event found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: event,
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
    const eventCreate = new Event({
      ...req.body,
    })
    await eventCreate.save()
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
    const event = await Event.findById(id)
    if (!event) {
      return res.json({
        code: 204,
        message: 'No Event found',
      })
    }
    const updated = await Event.findByIdAndUpdate(id, body)
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
    const event = await Event.findById(id)
    if (!event) {
      return res.json({
        code: 204,
        message: 'No Event found',
      })
    }
    const filesToDelete = []

    if (event.intro) filesToDelete.push(event.intro)
    if (event.logo > 0) filesToDelete.push(event.logo)
    if (event.streaming > 0) filesToDelete.push(event.streaming)
    if (event.video_list.length > 0) filesToDelete.push(...event.video_list)

    for (const filePath of filesToDelete) {
      const absolutePath = path.join(__dirname, '..', filePath)
      if (await fs.pathExists(absolutePath)) {
        await fs.remove(absolutePath)
      }
    }
    await Event.deleteOne()
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
