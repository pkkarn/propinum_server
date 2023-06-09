const workSchema = require('../schema/WorkSchema')

// Create work
exports.createWork = async (req, res, next) => {
    try {
        /**
         * @param {title, content, author}
         */

        const work = new workSchema({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id
        })

        await work.save();

         res.status(200).send({
            work,
        })
    } catch(err) {
         res.status(500).send(err)
    }
}

// Create work
exports.getAllSavedWork = async (req, res, next) => {
    try {
        const allWork = await workSchema.find({ author: req.user._id }).select(['title', 'content']);

         res.status(200).send({
            saved_works: allWork,
        })
    } catch(err) {
         res.status(500).send(err)
    }
}

// Create work:
exports.getWork = async (req, res, next) => {
    try {
        /**
         * @query { workId }
         */
        const workDetail = await workSchema.findById(req.params.workId).populate('author')
         res.status(200).send(workDetail)
    } catch(err) {
         res.status(500).send(err)
    }
}

