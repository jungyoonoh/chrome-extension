const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
<<<<<<< HEAD
    youtubeKeyword:{
        type:Array
    },
    stockKeyword:{
        type:Array
=======
    youtubeKeyword : {
        type:Array,
    },
    newsKeyword:{
        type:Array,
    },
    stockKeyword : {
        type:Array,
>>>>>>> fcb9b1b1f8446bcc714cc72a5b60fa2c38afe759
    }
});

module.exports = mongoose.model('User', UserSchema);