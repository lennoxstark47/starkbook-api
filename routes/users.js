const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

//updating a user
router.put('/:id', (req, res) => {
	if (
		req.body.userId === req.params.id ||
		req.body.isAdmin
	) {
		if (req.body.password) {
			req.body.password = bcrypt.hashSync(
				req.body.password,
				10
			);
		}
		User.findByIdAndUpdate(req.params.id, {
			$set: req.body,
		})
			.then((user) => {
				if (!user) {
					res
						.status(400)
						.json('Something is not working');
				}
				res.send('Account Has been updated');
			})
			.catch((err) => {
				res.status(500).json({ Error: err });
			});
	} else {
		res
			.status(500)
			.send('You dont have permission to update');
	}
});

module.exports = router;
