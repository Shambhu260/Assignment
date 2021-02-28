const express = require('express');
const router = express.Router();
const { createUser, deleteUser, getOne, updateUser, searchUser } = require('../controllers/user');


router.post('/user/create', createUser);
router.get('/user/getOne/:id', getOne);
router.put('/user/updateUser/:id', updateUser)
router.delete('/user/deleteJob_details/:id', deleteUser)
router.get('/user/search', searchUser)
module.exports = router;