const router = require('express').Router();
const { generatePropsal } = require('../../controllers/proposalController')

// http://localhost:7000/api/works [AUTH] and [BODY]
/**
 * @param {
        "title": "SDE 2",
        "content": "Work Content: SDE 2"
    }
 */
router.post('/generate', generatePropsal);

module.exports = router;