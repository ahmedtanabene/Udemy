var mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({

	email : {
		type :String,
		unique : true,
		required : true
	}, 

	username : String,
	password : String

});


var User = mongoose.model('users',userSchema);
module.exports = User;