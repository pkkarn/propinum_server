const UserSchema = require('../schema/UserSchema');
const verifyToken = require('../modules/verifyToken')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

exports.signUpAndLogin = async (req, res, next) => {
  try {
    // Extract access token from headers
    const authorization_code = req.headers.authorization.split(' ')[1];

      // Define the params
      const params = {
        code: authorization_code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET_ID,
        grant_type: 'authorization_code'
      };
  
      // Send POST request to Google's token endpoint
      const { data } = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify(params));
  
      // Extract tokens from response data
      const { access_token } = data;
      // const { access_token, id_token, refresh_token } = data;
    // Verify the access token
    const tokenInfo = await verifyToken(access_token);


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