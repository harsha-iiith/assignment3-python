const express = require('express');
const router = express.Router();
const { createGroup, joinGroup, userGroups, getQuestion, postQuestion, updateQuestion, deleteQuestion , getAllGroups, getUserRole, fetchBasedOnStatus, changeStatus} = require('../controllers/groupController');
const verifyUser = require('../middleware/authMiddleware');

router.post('/create', verifyUser, createGroup);
router.get('/all',verifyUser, getAllGroups);
router.post('/join', verifyUser, joinGroup);
router.get('/', verifyUser, userGroups);
router.post('/',verifyUser,fetchBasedOnStatus);

router.get('/:groupid', verifyUser, getQuestion);
router.post('/:groupid', verifyUser, postQuestion);
router.put('/:groupid/questions/:questionid', verifyUser, updateQuestion);
router.delete('/:groupid/questions/:questionid', verifyUser, deleteQuestion);
router.put('/:groupid',verifyUser,changeStatus);

// GET /api/groups/:classId/role
router.get("/:classId/role", verifyUser, getUserRole);

module.exports = router;