const mongoose = require('mongoose');

const accountInfo = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    buisnessName: String,
    password: String,
    phoneNumber: String,
    city: String,
    yourPick: String,
    loggedInKey: String,
    membershipExperationDate: [Date | String], // date or string
    ip: String
})

module.exports = mongoose.model('AccountInfo', accountInfo)