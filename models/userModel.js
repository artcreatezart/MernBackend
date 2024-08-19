const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Static sign up method
userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('All Fields mus be filled in')
    }

    //check if email is valid
    if(!validator.isEmail(email)) {
        throw Error ('Email is not valid')
    }

    // Check if password is strong enough
    //By default - min length 8; min lowercase 1; min number 1; min symbol 1
    if(!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough')
    }

    // Whats been clicked on whats been interacted with .. cant use this in a arrow fucntion have to use normal function
    const exists = await this.findOne({email})

    if (exists) {
        throw Error('Email is already in use')
    }

    /** Process of Bcrypt
     * 1. Normal Password: mypassword
     * 2. Add Salt: mypassword3k20293jr2 (add salt to end of password random 10characters)
     * 3. Hash: 64ad45hsad798dhkjs76d45
     */

    // Gen Salt with 10 characters
    const salt = await bcrypt.genSalt(10);
    // Hash the password and salt combined: 
    const hash = await bcrypt.hash(password, salt);

    // set the password to the hash value when creating the user:
    const user = await this.create({email, password: hash})
    
    return user
    
}

// Static Login Method
userSchema.statics.login = async function (email, password) {
    // Check if there is a value for the email and password
    if (!email || !password) {
        throw Error('All Fields must be filled in')
    }

    // try find the user in our db with the email
    const user = await this.findOne({email})

    // throw error if no user found 
    if (!user) {
        throw Error ('No User with this email found')
    }

    // compare passwords 
    const match = await bcrypt.compare(password, user.password) // return true or false

    // throw an error if they dont match
    if(!match) {
        throw Error ('Incorrect Password')
    }

    // if it does match
    return user
}

module.exports = mongoose.model('User', userSchema);