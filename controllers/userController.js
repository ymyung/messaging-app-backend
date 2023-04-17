const User = require('../models/userModel');
const Ticket = require('../models/ticketModel')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator');

// create tokens
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        .select( '-password' )
        .sort({ username: 1 })
        .populate({
            path: 'tickets',
            select: 'title description createdBy dev dateCreated dueDate type priority status dateResolved'
        })

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// get a single user
const getUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'});
    }

    const user = await User.findById(id)
    .populate({
        path: 'tickets',
        select: 'title description createdBy dev dateCreated dueDate type priority status dateResolved'
    })

    if(!user) {
        return res.status(404).json({error: 'No such user'});
    }

    res.status(200).json(user);
}

// create/sign up user
const signupUser = async (req, res) => {
    const { username, email, password, role, image } = req.body

    try {
        const user = await User.signup(username, email, password, role, image)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'});
    }

    const user = await User.findOneAndDelete({_id: id});

    if(!user) {
        return res.status(400).json({error: 'No such user'});
    }

    res.status(200).json(user);
}

// update a user
const updateUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'});
    }

    try {
        const user = await User.findOneAndUpdate({_id: id}, {
            ...req.body
        });
    
        if(!user) {
            return res.status(400).json({error: 'No such user'});
        }

        res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({error: error});
    }
}

module.exports = {
    getUsers,
    getUser,
    signupUser,
    loginUser,
    deleteUser,
    updateUser
}