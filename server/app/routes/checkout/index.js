var router = require('express').Router();
var mongoose = require('mongoose');

//	api/checkout

router.get('/', function(req, res, next) {
	
	if (req.user) {

		mongoose.model('User')
		.findById(req.user._id)
		.populate('shopping_cart').exec()
		.then(function (user) {  
			res.send(user.shopping_cart);
		}, next)

	} else if (req.session) {

		res.send(req.session.cart);
	};
});

router.post('/', function(req, res, next) {

	if (req.user) {

		    var userId = req.session.passport.user, userInfo = req.body.userInfo,
		    	cartInfo = req.body.cartInfo;  

		   	mongoose.model('Order').addToUsersOrderHistory(userId, userInfo, cartInfo, next)
		   		.then(function(updatedUser){
    				res.send({message: "Thank you for your purchase!"})
		   		}, next)
		   		
    } else {
    	res.send({message: "Thank you for your purchase!"})
    }

});


module.exports = router;