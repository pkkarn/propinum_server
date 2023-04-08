const UserSchema = require('../schema/UserSchema');
const verifyToken = require('../modules/verifyToken')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.signUpAndLogin = async (req, res, next) => {
  try {
    // Extract access token from headers
    const accessToken = req.headers.authorization.split(' ')[1];

    console.log({ auth:  req.headers})

    // Verify the access token
    const tokenInfo = await verifyToken(accessToken);

    if (!tokenInfo.email) {
      return res.status(400).json({ error: 'Email not found in token' });
    }

    // Check if a user with this email already exists
    let user = await UserSchema.findOne({ email: tokenInfo.email });

    // If the user doesn't exist, create a new one
    if (!user) {
      user = new UserSchema({
        email: tokenInfo.email,
        username: tokenInfo.email.split('@')[0]
        // Add any additional user fields here
      });
      await user.save();
    }

    // Create a JWT token with the user object
    const privateKey = fs.readFileSync(path.join(__dirname, '..', 'jwtRS256.key'), 'utf8');
    const token = jwt.sign({ user_id: user._id }, privateKey, { algorithm: 'RS256', expiresIn: '1y' });

    // Send the JWT token back
    res.status(200).json({ userToken: token, user });
  } catch (error) {
    next(error);
  }
};

exports.protectedData = async (req, res) => {
  console.log(req.user)
  res.status(200).send({ 'here is your token': { token: req.headers['authorization']}})
}

exports.userDetail = async (req, res) => {
  res.status(200).send(req.user)
}