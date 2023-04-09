const router = require('express').Router();
const workApi = require('./work')
const securedRoute = require('../middleware/authMiddlware')

router.use('/works', securedRoute, workApi)

module.exports = router;