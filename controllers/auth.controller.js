const User = require('../models/user.model')
const MediaFile = require('../models/mediafile.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const createError = require('http-errors')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require('../helpers/jwt_service')
const { userValidate } = require('../helpers/validation')
const { paginationDTO } = require('../models/default.dto')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const userList = await User.find({})
      .skip((page - 1) * size)
      .limit(size)
      .select('-password')
    const total = await User.countDocuments({})
    if (userList.length === 0) {
      return res.json({
        code: 204,
        message: 'No user found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: userList,
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

module.exports.signup = async (req, res) => {
  try {
    const { username, password, email, phone, avatar } = req.body
    const { error } = userValidate(req.body)
    if (error) {
      throw createError(error.details[0].message)
    }
    const existed = await User.findOne({
      email: email,
    })
    if (existed) {
      throw createError.Conflict(`${email} is ready been registed`)
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
      username,
      password: hashedPassword,
      email,
      phone,
      avatar,
    })
    await user.save()
    res.json({
      code: 200,
      message: 'Create account success',
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const { error } = userValidate(req.body)
    if (error) {
      throw createError(error.details[0].message)
    }
    const user = await User.findOne({
      email,
    })
    if (!user)
      return res.json({
        code: 400,
        message: 'User not registered',
      })

    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass)
      return res.json({
        code: 400,
        message: 'Invalid password',
      })
    const userInfo = await User.findOne({
      email,
    }).select('-password')
    const accessToken = await signAccessToken(user._id)
    const refreshToken = await signRefreshToken(user._id)
    res.header('Authorization', `bearer ${accessToken}`).send({
      code: 200,
      message: 'Login success',
      user: userInfo,
      accessToken: accessToken,
      refreshToken: refreshToken,
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
    const user = await User.findOne({ _id: id })
    if (!user) {
      return res.json({
        code: 204,
        message: 'Not found user',
      })
    }
    await user.deleteOne()
    res.json({
      code: 200,
      message: 'Delete user success',
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.refreshToken = async (req, res) => {
  try {
    console.log(req.body)
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.json({
        code: 400,
        error: 'Bad Request',
      })
    }
    const { userId } = await verifyRefreshToken(refreshToken)
    const user = await User.findById(userId).select('-password')
    const accessToken = await signAccessToken(userId)
    const newRefreshToken = await signRefreshToken(userId)
    res.json({
      code: 200,
      user,
      accessToken,
      newRefreshToken,
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1]
    await Session.findOneAndUpdate({ token }, { expired: true })
    res.send('Logged out successfully')
  } catch (error) {
    res.json({ code: 400, error: error.message })
  }
}

module.exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    if (!user) {
      return res.json({
        code: 204,
        message: 'Not found user',
      })
    }
    const mediaFiles = await MediaFile.find({ created_by: user._id })
    return res.json({
      code: 200,
      data: {
        ...user._doc,
        mediafiles: mediaFiles,
      },
    })
  } catch (error) {
    res.json({ code: 400, error: error.message })
  }
}
