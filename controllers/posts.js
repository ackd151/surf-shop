const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
const { cloudinary } = require('../cloudinary');

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        const posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 10,
            sort: { '_id': -1 } // or sort: '-_id'
        });
        posts.page = Number(posts.page);
        const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;
        res.render('posts/index', { posts, title: 'Posts Index', mapBoxToken });
    },

    // Posts New
    postNew(req, res, next) {
        res.render('posts/new', { title: 'New Post' });
    },

    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (let file of req.files) {
            // Push image path, filename onto post.images
            req.body.post.images.push({
                path: file.path,
                filename: file.filename
            });
        }
        // Get location coordinates from mapbox
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        // Attach geometry to req.body.post
        req.body.post.geometry = response.body.features[0].geometry;
        req.body.post.author = req.user._id;
        const post = new Post(req.body.post);
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        await post.save();
        req.session.success = 'Post created successfully!';
        res.redirect(`posts/${post._id}`);
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
            for (let filename of deleting) {
                // Remove from cloudinary hosting
                await cloudinary.uploader.destroy(filename);
                // Remove form post object
                for (let img of post.images) {
                    if (img.filename === filename) {
                        let index = post.images.indexOf(img);
                        post.images.splice(index, 1);
                    }
                }
            }
        }
        // Handle new images upload
        if (req.files) {
            for (let file of req.files) {
                post.images.push({
                    path: file.path,
                    filename: file.filename
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
            post.geometry = response.body.features[0].geometry;
            post.location = req.body.post.location;
        }
        // Change remaining properties
        post.title = req.body.post.title;
        post.price = req.body.post.price;
        post.description = req.body.post.description;
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        // Save changes to db
        await post.save();
        req.session.success = 'Post updated successfully.';
		res.redirect(`/posts/${post.id}`);
	},

    // Posts Delete
    async postDelete(req, res, next) {
        let post = await Post.findById(req.params.id); 
        for (let img of post.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
        await post.remove();
        req.session.success = 'Post deleted successfully.';
        res.redirect('/posts');
    }
}