const router = require('express').Router();
const workApi = require('./work')
const proposalApi = require('./proposal')
const securedRoute = require('../middleware/authMiddlware')

router.use('/works', securedRoute, workApi)
router.use('/proposal', securedRoute, proposalApi)

module.exports = router;