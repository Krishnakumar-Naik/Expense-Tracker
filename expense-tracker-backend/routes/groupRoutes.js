const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const GroupExpense = require('../models/GroupExpense');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Create a group
router.post('/', auth, async (req, res) => {
    try {
        const { name, memberEmails } = req.body;

        // Find users by email
        const members = await User.find({ email: { $in: memberEmails } });
        const memberIds = members.map(m => m._id);

        // Always include the creator
        if (!memberIds.some(id => id.toString() === req.user.id)) {
            memberIds.push(req.user.id);
        }

        const newGroup = new Group({
            name,
            createdBy: req.user.id,
            members: memberIds
        });

        const savedGroup = await newGroup.save();
        res.json(savedGroup);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Get user's groups
router.get('/', auth, async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
        res.json(groups);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Add expense to a group
router.post('/:groupId/expenses', auth, async (req, res) => {
    try {
        const { description, totalAmount, splits } = req.body;
        const groupId = req.params.groupId;

        const newExpense = new GroupExpense({
            description,
            totalAmount,
            paidBy: req.user.id,
            groupId,
            splits
        });

        const savedExpense = await newExpense.save();
        res.json(savedExpense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Get group expenses
router.get('/:groupId/expenses', auth, async (req, res) => {
    try {
        const expenses = await GroupExpense.find({ groupId: req.params.groupId })
            .populate('paidBy', 'name')
            .populate('splits.user', 'name');
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Search user by email (to add to group)
router.get('/search-user', auth, async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email }).select('name email');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
