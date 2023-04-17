const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, {timestamps: true});

// static sign up method
userSchema.statics.signup = async function(username, email, password, role, image) {
    // validation
    if (!username || !email || !password || !role) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error("email already in use")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ username, email, password: hash, role, image })

    return user
}

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    // find user
    const user = await this.findOne({ email })

    if (!user) {
        throw Error("Incorrect email")
    }

    // compare passwords
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect Password')
    }

    return user
}

// Change password
userSchema.statics.password = async function (_id, password) {
    if (!password) {
        throw Error('Password must be filled')
    } else if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    // find user 
    const exists = await this.findOne({_id: _id})

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.update({ password: hash })

    return user
}

module.exports = mongoose.model('User', userSchema);
