const mongoose = require('mongoose')

/** This one used to store user Work Detail or experience they might have */
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
    },
    workBio: {
        type: String,
    }
}, {
    timestamps: true
})


WorkSchema.pre('save', async function (next) {
    const now = new Date();
    this.updatedAt = now;
    if(!this.createdAt) {
        this.createdAt = now;
    }
    const author = await this.model('user').findById(this.author);
    this.workBio = `Hi, I am ${author ? author.username : ''} this is some of the things about me ${this.content}`;
    next();
})

WorkSchema.post('save', (doc)=> {
    console.log(`Work document with ID ${doc._id} was saved.`)
})

// sort of computed field not stored anywhere actually
// WorkSchema.virtual('description').get(() =>{
//     return `${this.title}: ${this.content}`
// })

module.exports = mongoose.model('work', WorkSchema);