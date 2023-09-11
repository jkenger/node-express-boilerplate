const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc    Login user
// @route   POST /auth
// @access  Public
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username or password" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(400).json({ message: "User not Found. Unauthorized." });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  // Create access token
  const accessToken = jwt.sign(
    {
      userInfo: {
        id: foundUser._id,
        username: foundUser.username,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  // Create refresh token
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Set refresh token in cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ accessToken });
};

// @desc    Refresh token
// @route   GET /auth/refresh
// @access  Public - beacuse access token has expired
exports.refresh = (req, res, next) => {
  // Check if refresh token exists
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify refresh token
  const refreshToken = cookies.jwt;

  // If refresh token is valid, create new access token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          userInfo: {
            id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );

      res.status(200).json({ accessToken });
    })
  );
};

// @desc    Logout user
// @route   POST /auth/logout
// @access  Public - clear cookies if exists
exports.logout = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(200).json({ message: "Logout successful" });
};
