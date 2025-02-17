/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /api/v1/auth:
 *   get:
 *     summary: Returns the list of all users (Admin only)
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: The number of page
 *      - in: query
 *        name: size
 *        schema:
 *          type: integer   
 *        description: The numbers of items to return 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: The token was successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Bad request
 */

const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth.controller')
const { verifyAccessToken } = require('../helpers/jwt_service')

router.get('/', controller.index);
// router.get('/', verifyAccessToken('Admin'), controller.index);
// router.post('/signup', controller.signup);
// router.post('/login', controller.login);
// router.post("/refresh-token", controller.refreshToken);

module.exports = router
