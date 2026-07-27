const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

// helper to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register a User - create user, save OTP, send email (no token yet)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    console.log("Register API Hit:", req.body);

    // prevent duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpire,
      isVerified: false
    });

    const message = `Your ShopEasy verification code is: ${otp}\nThis code will expire in 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification - Your OTP",
        message
      });
    } catch (emailErr) {
      // rollback user creation if email fails
      await user.deleteOne();
      return res.status(500).json({ success: false, message: "Failed to send OTP email. Try again later." });
    }

    return res.status(201).json({
      success: true,
      message: "OTP sent to email",
      email: user.email
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP -> set isVerified true and return token via sendToken
exports.verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP required", 400));
  }

  const user = await User.findOne({ email }).select("+password +otp +otpExpire +isVerified");
  if (!user) return next(new ErrorHandler("Invalid email or OTP", 400));

  if (user.isVerified) {
    return res.status(200).json({ success: true, message: "User already verified" });
  }

  if (!user.otp || user.otp !== otp || user.otpExpire < Date.now()) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  // send token (sets cookie & returns user/token depending on implementation)
  sendToken(user, 200, res);
});

// Resend OTP
exports.resendOTP = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.isVerified) {
    return res.status(400).json({ success: false, message: "User already verified" });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const message = `Your new verification code is: ${otp}\nIt expires in 10 minutes.`;
  await sendEmail({ email: user.email, subject: "Resent OTP Code", message });

  res.status(200).json({ success: true, message: "OTP resent to email" });
});

// Login - only allow if user is verified
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password +isVerified");
  if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  if (!user.isVerified) {
      return next(new ErrorHandler("Email not verified. Please verify your email first.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});


// logout user 
exports.logout = catchAsyncError(async (req, res, next) => {

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    })
    res.status(200).json({
        sucess: true,
        message: "Logged Out"
    })
});


//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });// validateBeforeSave:false is used to avoid the validation of the fields before saving the data

    //Create reset password URL - pointing to frontend
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.\n\nThis link will expire in 15 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message: message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;//if there is any error then reset the resetPasswordToken field to undefined
        user.resetPasswordExpire = undefined;//if there is any error then reset the resetPasswordExpire field to undefined
        await user.save({ validateBeforeSave: false });//if there is any error then save the user data with validateBeforeSave:false
        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //Hash URL Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });


    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    //Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//get User Details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });

})

// update password by user
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);

});

//Update user profile by user
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    });

    res.status(200).json({
        success : true
    });

});


//Admin Routes

//Get all users --Admin
exports.getAllUsers  = catchAsyncError(async(req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        success : true,
        users
    });
})

//Get Single User Details --Admin
exports.getSingleUserAdmin = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not found with id ${req.params.id}`));
    }
    res.status(200).json({
        success : true,
        user
    })
});


// Update User Profile by --Admin
exports.updateUserAdmin = catchAsyncError(async(req,res,next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    });

    res.status(200).json({
        success : true
    });

});


// Delete User by --Admin
exports.deleteUserAdmin = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
        return next(new ErrorHandler("User not found", 404)); // Return a 'User not found' error with a 404 status code
    }

    // Delete the user if found
    await user.deleteOne();

    // Send success response after deletion
    res.status(200).json({
        success: true,
        message: "User has been deleted successfully"
    });
});

