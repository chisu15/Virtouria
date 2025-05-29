const Mediafile = require('../models/mediafile.model')

const fs = require('fs-extra')
const path = require('path')

const { paginationDTO } = require('../models/default.dto')
const { log } = require('console')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const mediafileList = await Mediafile.find({})
      .skip((page - 1) * size)
      .limit(size)
    const total = await Mediafile.countDocuments({})
    if (mediafileList.length === 0) {
      return res.json({
        code: 204,
        message: 'No Mediafile found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: mediafileList,
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

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const mediafile = await Mediafile.findById(id)

    if (!mediafile) {
      return res.json({
        code: 204,
        message: 'No MediaFile found',
      })
    }

    const filePath = path.join(__dirname, '..', mediafile.path)

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath)
    }

    await mediafile.deleteOne()

    res.json({
      code: 200,
      message: 'Delete success',
      deletedFile: mediafile.path,
    })
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.upload = async (req, res) => {
  try {
    console.log(req.body)

    if (!req.files || req.files.length === 0 || !req.body.folder) {
      return res.status(400).json({
        code: 400,
        message: 'Thiếu file hoặc folder',
      })
    }

    const folderPath = path.join(__dirname, '../public', req.body.folder)
    await fs.ensureDir(folderPath)

    const uploadedFiles = []
    for (const file of req.files) {
      const timestamp = Date.now()
      const fileExtension = path.extname(file.originalname)
      const newFileName = `${timestamp}${fileExtension}`
      const filePath = path.join(folderPath, newFileName)

      await fs.writeFile(filePath, file.buffer)

      const filePublicPath = `public/${req.body.folder}/${newFileName}`

      const newMediaFile = await Mediafile.create({
        type: file.mimetype,
        size: file.size,
        path: filePublicPath,
        created_by: req.body.created_by,
        position: req.body.position || null,
        scale: JSON.parse(req.body.scale) || null
      })

      uploadedFiles.push({
        filename: newFileName,
        path: filePublicPath,
        type: file.mimetype,
        size: file.size,
      })
    }

    res.json({
      code: 200,
      message: 'Upload success',
      files: uploadedFiles,
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error.message,
    })
  }
}
