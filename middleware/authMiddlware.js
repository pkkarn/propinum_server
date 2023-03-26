const {verifyJwtToken} = require('../modules/verifyJwtToken')
const UserSchema = require('../schema/UserSchema');

const verifyAuthToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If the Authorization header is missing or does not start with 'Bearer '
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Extract the token from the Authorization header
    const authToken = authHeader.split(' ')[1];
  
    try {
      // Verify the token using your authentication logic
      const userId = await verifyJwtToken(authToken);
      console.log(userId);

      const user = await UserSchema.findById({ _id: userId});
  
      // Attach the user to the request object
      req.user = user;
  
      // Move to the next middleware function
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  module.exports = verifyAuthToken;
  