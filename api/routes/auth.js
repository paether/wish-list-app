/* eslint-disable camelcase */
const router = require('express').Router();
const verifyToken = require('../verifyToken');
const auth_controller = require('../controllers/authController');

// create list and log user in
router.post('/create', auth_controller.create_post);

// login for the specific list
router.post('/login', auth_controller.login_post);

// ad-hoc admin login for already logged in user
router.post('/adminlogin/:id', verifyToken, auth_controller.adminlogin_post);

module.exports = router;
