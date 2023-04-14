const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  signupUser,
  loginUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// get all users
router.get('/', getUsers);

// get a single user
router.get('/:id', getUser);

// post/sign up a new user
router.post('/signup', signupUser);

// login a user
router.post('/login', loginUser);

// update a user
router.patch('/:id', updateUser);

// delete a user
router.delete('/:id', deleteUser);

module.exports = router;
