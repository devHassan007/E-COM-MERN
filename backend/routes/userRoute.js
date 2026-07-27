const express = require('express');
const {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUserAdmin,
  updateUserAdmin,
  deleteUserAdmin
} = require('../controllers/userController.js');

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/verify-otp').post(verifyOTP);    // NEW
router.route('/resend-otp').post(resendOTP);    // NEW
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logout);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);

router
    .route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizedRoles('admin'), getSingleUserAdmin)
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateUserAdmin)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUserAdmin);

module.exports = router;
