const faker = require('faker');
const Post = require('./models/post');
const cities = require('./cities');

async function seedPosts() {
	await Post.deleteMany({});	// clear collection
	for(const i of new Array(600)) {
		const random5 = Math.floor(Math.random() * 6);
		const random1000 = Math.floor(Math.random() * 1000);
		const title = faker.lorem.word();
		const price = random1000;
		const avgRating = random5;
		const description = faker.lorem.text();
		const postData = {
			title,
			price,
			description,
			avgRating,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			author: '606ce864e1c4cf2ff0828ff5'
		}
		let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		await post.save();
	}
	console.log('600 new posts created');
}

module.exports = seedPosts;