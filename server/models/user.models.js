const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = new mongoose.Schema({
    screenName: {
        type: String,
        required: [true, 'A screen name is required.'],
        minLength: [2, 'Screen names must be at least 2 characters long.']
    },
    email: {
        type: String,
        required: [true, 'Gimme an email'],
        minLength: [2, 'Emails need to be at least 2 characters long.']
    },
    password: {
        type: String,
        required: [true, 'Password required!'],
        minLength: [2, 'Passwords need to be at least 2 characters long.']
    },

}, {timestamps: true} )

Schema.virtual('confirmPassword')
    .get( () => this._confirmPassword )
    .set( e => this._confirmPassword = e );

Schema.pre('validate', function(next){
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Passwords must match!!')
    }
    next()
})

// check confirm email.  Optional...
// Schema.virtual('confirmE')
//     .get( () => this._confirmE )
//     .set( e => this._confirmE = e);
// Schema.pre('validate', function(next){
//     if (this.email !== this.confirmE) {
//         this.invalidate('confirmE', 'Emails must match💜💜!!')
//     }
//     next()
// })


// SAVE ENCRYPTED PASSWORD
Schema.pre('save', async function (next) {
    try {
        // hash the password, 10 times
        const hashedPassword = await bcrypt.hash(this.password, 10)
        // update password with hashed password
        this.password = hashedPassword
        next()
    } catch (err) {
        console.log('ERROR IN SAVE: ', err)
    }
})

module.exports = mongoose.model('User', Schema)
