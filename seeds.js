const faker = require('faker');
const Post = require('./models/post');

console.log('seeds.js');
const numPosts = 40;
async function seedPosts() {
    await Post.deleteMany({});
    for (const i of new Array(numPosts)) {
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            location: 'San Francisco',
            coordinates: [-122.420679, 37.772537],
            price: faker.datatype.number({'min': 1, 'max': 1000}),
            author: {
                '_id': '6063a96d49df42196c38a915',
                username: 'ack-d'
            }
        }
        await Post.create(post);
    }
    console.log(`${numPosts} new posts created`);
}

module.exports = seedPosts;