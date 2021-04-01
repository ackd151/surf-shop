const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'ackd151',
    api_key: '988843633939511',
    api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        const posts = await Post.find({});
        res.render('posts/index', { posts });
    },

    // Posts New
    postNew(req, res, next) {
        res.render('posts/new');
    },

    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (let file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        const newPost = await Post.create(req.body.post);
        res.redirect(`posts/${newPost._id}`);
    },

    // Posts Show
    async postShow(req, res, next) {
        const post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    },

    // Posts Edit
    async postEdit(req, res, next) {
        const post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },

    // Posts Update
	async postUpdate(req, res, next) {
		const post = await Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true });
		res.redirect(`/posts/${post.id}`);
	},

    // Posts Delete
    async postDelete(req, res, next) {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/posts');
    }
}