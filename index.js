'use strict';

const { config } = require('./package.json');
const WordPressClient = require('wp-api-client');
const client = new WordPressClient(config.baseUrl);

/**
 * Retrieve contents of [haiku.ist/about](https://haiku.ist/about/) page.
 * @return {Promise<Page>} _About page._
 */
const about = () => client.fetchPage(config.aboutPage);
/**
 * Get total number of haikus.
 * @return {Promise<Number>} _Total number of haikus available._
 */
const count = () => client.countPosts({ categories: config.haikus });
/**
 * Retrieve multiple haikus from [haiku.ist](https://haiku.ist) archive.
 * @param  {Object} options WordPress REST API `/posts` endpoint
 *                          [arguments](https://developer.wordpress.org/rest-api/reference/posts/#arguments).
 * @param {Number} [options.pageSize=10] Maximum number of items to be returned in result set.
 * @return {Promise<Response<Post>>} _Paginated listing of haiku posts._
 */
const fetchPosts = options => client.fetchPosts({ ...options, categories: config.haikus });

module.exports = {
  about,
  count,
  fetchLatest,
  fetchPosts,
  fetchRandom
};

/**
 * Fetch latest haiku.
 * @return {Promise<Post>} _Latest post containing haiku._
 */
async function fetchLatest() {
  const { items: posts } = await fetchPosts({ pageSize: 1 });
  return posts[0];
}

/**
 * Fetch random haiku from [haiku.ist](https://haiku.ist) archive.
 * @return {Promise<Post>} _Random post containing haiku._
 */
async function fetchRandom() {
  const max = await count();
  const offset = random(max);
  const { items: posts } = await fetchPosts({ offset });
  return posts[0];
}

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * WordPress API client `Page` response type.
 * @typedef {WordPressClient.Page} Page
 * @see https://www.npmjs.com/package/wp-api-client#page
 */
/**
 * WordPress API client `Post` response type.
 * @typedef {WordPressClient.Post} Post
 * @see https://www.npmjs.com/package/wp-api-client#post
 */

/**
 * WordPress API client response type used for paginated responses.
 * @typedef {WordPressClient.Response<T>} Response @template T
 * @see https://www.npmjs.com/package/wp-api-client#response
 */
