const JWT = require('jsonwebtoken')
const User = require('../models/user.model')

module.exports.verifyRole = (role) => {
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
      const user = await User.findById(payload.userId).select('-password')
      const userRole = user.role
      if (!user || userRole != role ) {
        return res.status(403).json({
          code: 403,
          message: 'Forbidden',
        })
      }
      req.user = user
      next()
    })
  }
}
