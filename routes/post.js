const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post('/', (req, res) => {
	const { desc, img, userId } = req.body;
	const newPost = new Post({
		desc,
		img,
		userId,
	});
	newPost
		.save()
		.then((post) => {
			if (!post) {
				res
					.status(400)
					.send('Error creating post');
			}
			res.send(post);
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

//updating a post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(
			req.params.id
		);
		if (
			post.userId === req.body.userId ||
			req.body.isAdmin
		) {
			await post.updateOne({ $set: req.body });
			res
				.status(200)
				.send('Post succesfully updated');
		} else {
			res
				.status(403)
				.send('You can update only your post');
		}
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

//deleting a post
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(
			req.params.id
		);
		if (
			post.userId === req.body.userId ||
			req.body.isAdmin
		) {
			await post.deleteOne();
			res
				.status(200)
				.send('Post succesfully deleted');
		} else {
			res
				.status(403)
				.send('You can delete only your post');
		}
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

//liking a post
router.put('/:id/like', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (post) {
				if (
					!post.likes.includes(req.body.userId)
				) {
					post
						.updateOne({
							$push: { likes: req.body.userId },
						})
						.then((data) => {
							res
								.status(200)
								.send(
									'Liked the post seuccessfully'
								);
						})
						.catch((err) => {
							res.status(500).json(err);
						});
				} else {
					post
						.updateOne({
							$pull: { likes: req.body.userId },
						})
						.then((data) => {
							res
								.status(200)
								.send('Disliked the post');
						})
						.catch((err) => {
							res.status(200).json(err);
						});
				}
			} else {
				res.status(404).send('Cant find post');
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

//get a post
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (post) {
				res.status(200).send(post);
			} else {
				res
					.status(404)
					.send('Error getting the post');
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

//get timeline
router.get('/timeline/all', async (req, res) => {
	try {
		const currentUser = await User.findById(
			req.body.userId
		);
		const userPosts = await Post.find({
			userId: currentUser._id,
		});
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
