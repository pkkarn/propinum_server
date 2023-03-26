const axios = require('axios');

module.exports = async (access_token) => {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`)
    return response.data;
}