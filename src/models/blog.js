const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title : {
        type: 'string',
        required: true,
    },
    description: {
        type: Object,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true})


const blog = mongoose.model('blog', blogSchema)

module.exports = blog;