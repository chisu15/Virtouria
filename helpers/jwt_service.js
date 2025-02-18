const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const User = require('../models/user.model')

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId }
    const secret = process.env.ADMIN_JWT_SECRET
    const options = {
      expiresIn: process.env.EXPIRE_TIME, //10m 10s
    }

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

const verifyAccessToken = () => {
  return async (req, res, next) => {
    if (!req.headers['authorization']) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
      })
    }
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    JWT.verify(token, process.env.ADMIN_JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).json({
          code: 401,
          message: err.message,
        })
      }
      req.payload = payload
      next()
    })
  }
}

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId }
    const secret = process.env.ADMIN_JWT_REFRESH_SECRET
    const options = {
      expiresIn: '1y',
    }

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.ADMIN_JWT_REFRESH_SECRET,
      (err, payload) => {
        if (err) {
          return reject(err)
        }
        resolve(payload)
      },
    )
  })
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}
