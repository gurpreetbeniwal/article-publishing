const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['pdf', 'text'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pdfFile: {
        type: String,
        required: function () { return this.type === 'pdf'; }
    },
    textContent: {
        type: String,
        required: function () { return this.type === 'text'; }
    },
    status: {
        type: Boolean,
        default: false
    },
    contentType: { // New field for content type
        type: String,
        enum: ['article', 'report', 'book'], // Allowed values
        required: true // Make it required
    }
    }, { timestamps: true });


const Content = mongoose.model('Content', ContentSchema);
module.exports = Content;
