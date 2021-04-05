const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'ackd151',
    api_key: '988843633939511',
    api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        const posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 10
        });
        posts.page = Number(posts.page);
        res.render('posts/index', { posts, title: 'Posts Index' });
    },

    // Posts New
    postNew(req, res, next) {
        res.render('posts/new', { title: 'New Post' });
    },

    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (let file of req.files) {
            // Upload images to cloudinary
            let image = await cloudinary.v2.uploader.upload(file.path, { folder: 'surf-shop'});
            // Push image url, public_id onto post.images
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        // Get location coordinates from mapbox
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        // Attach coordinates to req.body.post
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        req.body.post.author = req.user._id;
        const newPost = await Post.create(req.body.post);
        req.session.success = 'Post created successfully!';
        res.redirect(`posts/${newPost._id}`);
    },

    // Posts Show
    async postShow(req, res, next) {
        const post = await Post.findById(req.params.id).populate({
            path: 'author',
            model: 'User'
        })
        .populate({
            path: 'reviews',
            options: {
                sort: { '_id': -1 }
            },
            populate: {
                path: 'author',
                model: 'User'
            }
        });
        const floorRating = post.calculateAvgRating();
        const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;
        res.render('posts/show', { post, title: post.title, mapBoxToken, floorRating });
    },

    // Posts Edit
    async postEdit(req, res, next) {
        const post = await Post.findById(req.params.id);
        res.render('posts/edit', { post, title: 'Edit Post' });
    },

    // Posts Update
	async postUpdate(req, res, next) {
		const post = await Post.findById(req.params.id);
        // Handle image deletion
        if (req.body.deleteImages && req.body.deleteImages.length) {
            const deleting = req.body.deleteImages;
            for (let public_id of deleting) {
                // Remove from cloudinary hosting
                await cloudinary.v2.uploader.destroy(public_id);
                // Remove form post object
                for (let img of post.images) {
                    if (img.public_id === public_id) {
                        let index = post.images.indexOf(img);
                        post.images.splice(index, 1);
                    }
                }
            }
        }
        // Handle new images upload
        if (req.files) {
            for (let file of req.files) {
                let image = await cloudinary.v2.uploader.upload(file.path, { folder: 'surf-shop'});
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
            }
        }
        // Update location/coordinates if changed
        if (req.body.post.location !== post.location) {
            // Get location coordinates from mapbox
            let response = await geocodingClient
                .forwardGeocode({
                    query: req.body.post.location,
                    limit: 1
                })
                .send();
            // Attach coordinates to post
            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location;
        }
        // Change remaining properties
        post.title = req.body.post.title;
        post.price = req.body.post.price;
        post.description = req.body.post.description;
        // Save changes to db
        await post.save();
        req.session.success = 'Post updated successfully.';
		res.redirect(`/posts/${post.id}`);
	},

    // Posts Delete
    async postDelete(req, res, next) {
        let post = await Post.findById(req.params.id); 
        for (let img of post.images) {
            await cloudinary.v2.uploader.destroy(img.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted successfully.';
        res.redirect('/posts');
    }
}