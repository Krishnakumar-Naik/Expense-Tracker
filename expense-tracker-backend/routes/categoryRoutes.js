const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Category = require('../models/Category');

// Get categories
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.id });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add category
router.post('/', auth, async (req, res) => {
    const { name, type, isDefault } = req.body;
    try {
        // Check if category already exists (case-insensitive)
        const existingCategory = await Category.findOne({
            userId: req.user.id,
            name: { $regex: new RegExp("^" + name.toLowerCase() + "$", "i") }
        });

        if (existingCategory) {
            return res.status(400).json({ msg: 'Category already exists' });
        }

        const newCategory = new Category({
            userId: req.user.id,
            name,
            type,
            isDefault
        });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update category
router.put('/:id', auth, async (req, res) => {
    const { name, type } = req.body;
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        if (category.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Check if new name already exists for another category
        if (name) {
            const existingCategory = await Category.findOne({
                userId: req.user.id,
                name: { $regex: new RegExp("^" + name.toLowerCase() + "$", "i") },
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(400).json({ msg: 'A category with this name already exists' });
            }
        }

        category = await Category.findByIdAndUpdate(req.params.id, { $set: { name, type } }, { new: true });
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        if (category.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Category.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
