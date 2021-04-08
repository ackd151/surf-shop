const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	email: { type: String, unique: true, required: true },
	image: {
		path: {
			type: String,
			default: '/images/default-profile.jpg'
		},
		filename: String
	}
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
