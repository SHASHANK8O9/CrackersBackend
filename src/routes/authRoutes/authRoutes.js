import express from "express";
import {
  deleteAccount,
  forgetPassword,
  getAllUsers,
  login,
  newPassword,
  resetPassword,
  signUp,
  updateProfile,
  verifyOtp,
  verifyOtpForDeleteAccount,
  verifyOtpForForgotPassword,
  verifyResetPasswordOtp,
} from "../../controllers/auth/auth.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/verifyOtp").post(verifyOtp);
router.route("/updateProfile").post(updateProfile);
router.route("/resetPassword").post(resetPassword);
router.route("/verifyResetPasswordOtp").post(verifyResetPasswordOtp);
router.route("/deleteAccount").delete(deleteAccount);
router.route("/verifyOtpForDeleteAccount").post(verifyOtpForDeleteAccount);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyOtpForForgotPassword").post(verifyOtpForForgotPassword);
router.route("/newPassword").post(newPassword);
router.route("/").get(getAllUsers);
export default router;
