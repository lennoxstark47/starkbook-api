const router = require('express').Router();
const Post = require('../models/Post');

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
router.put('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (post) {
				if (
					post.userId === req.body.userId ||
					req.body.isAdmin
				) {
					Post.findByIdAndUpdate({
						desc: req.body.desc,
					})
						.then((response) => {
							res
								.status(200)
								.send(
									'Post has been successfully updated'
								);
						})
						.catch((err) => {
							res
								.status(500)
								.json({ error: err });
						});
				} else {
					res
						.status(403)
						.send(
							'you can update only your post'
						);
				}
			} else {
				res
					.status(500)
					.send('Error getting the post');
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

module.exports = router;
