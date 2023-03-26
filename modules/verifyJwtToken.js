const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const verifyJwtToken = (token) => {
  try {
    // Verify the token using the secret key
    const publicKey = fs.readFileSync(path.join(__dirname, '..', 'jwtRS256.key'), 'utf8');
    // console.log(publicKey)


    const decoded = jwt.verify(token, publicKey);
    console.log(decoded)
    // Return the decoded user object
    return decoded.user_id;
  } catch (error) {
    // If the token is invalid, throw an error
    throw new Error('Invalid token');
  }
}

module.exports = {verifyJwtToken};