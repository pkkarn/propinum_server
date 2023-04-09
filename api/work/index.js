const router = require('express').Router();
const { getWork, getAllSavedWork, createWork } = require('../../controllers/workController')

// http://localhost:7000/api/works [AUTH]
router.get('/', getAllSavedWork);

// http://localhost:7000/api/works [AUTH] and [BODY]
/**
 * @param {
        "title": "SDE 2",
        "content": "Work Content: SDE 2"
    }
 */
router.post('/', createWork);

// http://localhost:7000/api/works/work/64326ff0093ed8e5f7c3b93b [AUTH]
router.get('/work/:workId', getWork);

module.exports = router;