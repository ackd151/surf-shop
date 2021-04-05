const faker = require('faker');
const Post = require('./models/post');

console.log('seeds.js');
const numPosts = 40;
async function seedPosts() {
    await Post.remove({});
    for (const i of new Array(numPosts)) {
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
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