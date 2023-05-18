import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import nodeMailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const authUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res
      .status(401)
      .json({ error: 'Username / email address does not exists.' });
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    // The user is not authenticated, so return an error message.
    res.status(401).json({ error: 'Invalid password.' });
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;

  const userExists = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (userExists) {
    return res.status(400).json({
      error: 'Username or Email address already exists',
    });
  }

  const user = await User.create({
    username,
    name,
    email,
    profile: `${process.env.CLIENT_URL}/profile/${username}`,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      profile: `${process.env.CLIENT_URL}/profile/${username}`,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({
      error: 'Invalud user data',
    });
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return res.status(404).json({ error: 'User not found' });
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      username: updatedUser.username,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      error: 'User with that email does not exist',
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
    expiresIn: '1d',
  });

  // email
  const emailData = {
    from: process.env.EMAIL_FROM, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
    to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
    subject: `Password Reset Link`,
    html: `
        <p>Please use the following link to reset your password:</p>
        <p>${process.env.CLIENT_URL}/login/password/reset/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
    `,
  };

  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'ketofoodgenerator@gmail.com', // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: 'jcyaocdchulixvji', // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  const userUpdate = await user.updateOne({ resetPasswordLink: token });

  if (userUpdate) {
    transporter
      .sendMail(emailData)
      .then((info) => {
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`,
        });
      })
      .catch((err) => console.log(`Problem sending email: ${err}`));
  } else {
    return res.json({ error: 'Something error.' });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: 'Expired link. Try again',
          });
        }
        const user = await User.findOne({ resetPasswordLink });

        if (!user) {
          return res.status(401).json({
            error: 'Something went wrong. Try later',
          });
        }

        user.password = newPassword;
        user.resetPasswordLink = '';

        const updatedUser = await user.save();

        if (updatedUser)
          res.json({
            success: `Great! Now you can login with your new password`,
          });
      }
    );
  }
});
