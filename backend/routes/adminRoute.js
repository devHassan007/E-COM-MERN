const express = require("express");
const {
  getDashboardStats,
  createReturnRequest,
  getMyReturns,
  getAllReturns,
  getSingleReturn,
  approveReturn,
  rejectReturn,
  schedulePickup,
  confirmItemReceived,
  processRefund,
  processReplacement,
  deleteReturn,
} = require("../controllers/adminController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

// Dashboard Stats
router.route("/dashboard/stats").get(isAuthenticatedUser, authorizedRoles("admin"), getDashboardStats);

// Customer Routes
router.route("/return/new").post(isAuthenticatedUser, createReturnRequest);
router.route("/returns/me").get(isAuthenticatedUser, getMyReturns);

// Admin Routes
router.route("/admin/returns").get(isAuthenticatedUser, authorizedRoles("admin"), getAllReturns);
router.route("/return/:id").get(isAuthenticatedUser, getSingleReturn);

router.route("/admin/return/:id/approve").put(isAuthenticatedUser, authorizedRoles("admin"), approveReturn);
router.route("/admin/return/:id/reject").put(isAuthenticatedUser, authorizedRoles("admin"), rejectReturn);
router.route("/admin/return/:id/pickup").put(isAuthenticatedUser, authorizedRoles("admin"), schedulePickup);
router.route("/admin/return/:id/received").put(isAuthenticatedUser, authorizedRoles("admin"), confirmItemReceived);
router.route("/admin/return/:id/refund").put(isAuthenticatedUser, authorizedRoles("admin"), processRefund);
router.route("/admin/return/:id/replacement").put(isAuthenticatedUser, authorizedRoles("admin"), processReplacement);
router.route("/admin/return/:id").delete(isAuthenticatedUser, authorizedRoles("admin"), deleteReturn);

module.exports = router;
