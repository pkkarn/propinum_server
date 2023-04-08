const router = require('express').Router();
const { signUpAndLogin, protectedData, userDetail } = require('../controllers/authControllers')
const securedRoute = require('../middleware/authMiddlware')
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Auth'})
})

router.post('/authenticate', signUpAndLogin)
router.get('/protect', securedRoute, protectedData)
router.post('/me', securedRoute, userDetail)

module.exports = router