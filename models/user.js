const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
  username: String,
  password: String,
  email: String  
})

module.exports = user;
