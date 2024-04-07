const express = require('express');
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { ensureAuth, ensureAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', ensureAuth, ensureAdmin, getAllUsers);
router.put('/:id/role', ensureAuth, ensureAdmin, updateUserRole);

module.exports = router;