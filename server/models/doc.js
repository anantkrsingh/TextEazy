const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: Object, 
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
}, {
    timestamps: true, 
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;