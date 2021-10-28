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

//deleting an user
router.delete('/:id', (req, res) => {
	if (
		req.body.userId === req.params.id ||
		req.body.isAdmin
	) {
		User.findByIdAndDelete(req.params.id)
			.then((data) => {
				if (!data) {
					res
						.status(400)
						.json('Something is not working');
				}
				res.send('Account Has been deleted');
			})
			.catch((err) => {
				res.status(500).json({ err });
			});
	} else {
		res
			.status(500)
			.send('You dont have permission to delete');
	}
});

//get a user
router.get('/:id', (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			if (!user) {
				res.status(400).send('User not found');
			} else {
				res.send(user);
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

//following a user
router.put('/:id/follow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(
				req.params.id
			);
			const currentUser = await User.findById(
				req.body.userId
			);
			if (
				!user.followers.includes(req.body.userId)
			) {
				await user.updateOne({
					$push: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$push: { following: req.params.id },
				});
				res
					.status(200)
					.send(
						`You are succesfully following ${user.username}`
					);
			} else {
				res
					.status(403)
					.send(
						`You already follow ${user.username}`
					);
			}
		} catch (err) {
			res.status(400).json(err);
		}
	} else {
		res
			.status(403)
			.send('You cant follow yourself');
	}
});

//unfollowing a user
router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(
				req.params.id
			);
			const currentUser = await User.findById(
				req.body.userId
			);
			if (
				user.followers.includes(req.body.userId)
			) {
				await user.updateOne({
					$pull: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$pull: { following: req.params.id },
				});
				res
					.status(200)
					.send(
						`${user.username} has been unfollowed`
					);
			} else {
				res
					.status(403)
					.send(
						`You dont follow ${user.username} anymore`
					);
			}
		} catch (err) {
			res.status(400).json(err);
		}
	} else {
		res
			.status(403)
			.send('You cant unfollow yourself');
	}
});

module.exports = router;
