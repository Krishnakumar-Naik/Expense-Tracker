const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Budget = require('../models/Budget');

// Set budget
router.post('/', auth, async (req, res) => {
    const { category, limit, month } = req.body;
    try {
        let budget = await Budget.findOne({ userId: req.user.id, category, month });
        if (budget) {
            budget = await Budget.findOneAndUpdate(
                { userId: req.user.id, category, month },
                { $set: { limit } },
                { new: true }
            );
        } else {
            budget = new Budget({
                userId: req.user.id,
                category,
                limit,
                month
            });
            await budget.save();
        }
        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get budget
router.get('/', auth, async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json(budgets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
