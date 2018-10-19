const mongoose = require('mongoose');

// Note: Match data access patterns for best preformance

const accountInfo = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    buisnessName: String, //Array []
    password: String,
    phoneNumber: String,
    city: String,
    yourPick: String,
    loggedInKey: String,
    membershipExperationDate: [Date | String], // date or string
    ip: String
})

module.exports = mongoose.model('AccountInfo', accountInfo)