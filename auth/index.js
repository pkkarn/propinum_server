const router = require('express').Router();
const { signUpAndLogin, protectedData } = require('../controllers/authControllers')
const securedRoute = require('../middleware/authMiddlware')
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Auth'})
})

router.post('/authenticate', signUpAndLogin)
router.get('/protect',securedRoute, protectedData)

module.exports = router