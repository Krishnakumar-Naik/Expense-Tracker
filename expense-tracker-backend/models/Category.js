const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], default: 'expense' },
    isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model('Category', CategorySchema);
