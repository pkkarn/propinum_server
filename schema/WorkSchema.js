const mongoose = require('mongoose')

const WorkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
})


WorkSchema.pre('save', (next) => {
    const now = new Date();
    this.updatedAt = now;
    if(!this.createdAt) {
        this.createdAt = Date;
    }
    next()
})

WorkSchema.post('save', (doc)=> {
    console.log(`Work document with ID ${doc._id} was saved.`)
})

// sort of computed field not stored anywhere actually
// WorkSchema.virtual('description').get(() =>{
//     return `${this.title}: ${this.content}`
// })

module.exports = mongoose.model('work', WorkSchema);