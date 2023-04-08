const router = require('express').Router();
const workApi = require('./work')
const securedRoute = require('../middleware/authMiddlware')

router.use('/work', securedRoute, workApi)

module.exports = router;