const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send({
        msg: 'hello from wrok'
    })
})

module.exports = router;