'use strict';

const { config } = require('./package.json');
const client = new (require('wp-api-client'))(config.baseUrl);

const about = () => client.fetchPage(config.aboutPage);
const count = () => client.countPosts({ categories: config.haikus });
const fetchPosts = options => client.fetchPosts({ ...options, categories: config.haikus });

module.exports = {
  about,
  count,
  fetchLatest,
  fetchPosts,
  fetchRandom
};

async function fetchLatest() {
  const { items: posts } = await fetchPosts({ pageSize: 1 });
  return posts[0];
}

async function fetchRandom() {
  const max = await count();
  const offset = random(max);
  const { items: posts } = await fetchPosts({ offset });
  return posts[0];
}

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
