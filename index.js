'use strict';

const minidom = require('minidom');
const r = require('got');
const urlJoin = require('url-join');

const API_URL = 'https://haiku.ist/wp-json/wp/v2/';

const getText = el => el.textContent.trim();

module.exports = {
  count,
  fetchLatest,
  fetchPosts,
  fetchRandom
};

async function fetchLatest() {
  const { posts } = await fetchPosts({ pageSize: 1 });
  return posts[0];
}

async function fetchRandom() {
  const max = await count();
  const offset = random(max);
  const { posts } = await fetchPosts({ offset });
  return posts[0];
}

async function count() {
  const url = urlJoin(API_URL, '/posts');
  const { headers } = await r.head(url);
  return parseInt(headers['x-wp-total'], 10);
}

async function fetchPosts({ pageSize = 10, offset = 0 } = {}) {
  const query = `per_page=${pageSize}&offset=${offset}`;
  const url = urlJoin(API_URL, `/posts?${query}`);
  const { headers, body = [] } = await r.get(url, { json: true });
  const total = parseInt(headers['x-wp-total'], 10);
  const totalPages = parseInt(headers['x-wp-totalpages'], 10);
  const posts = body.map(it => ({
    id: it.id,
    createdAt: it.date,
    modifiedAt: it.date,
    link: it.link,
    ...parsePost(it)
  }));
  return { total, totalPages, pageSize, posts };
}

function parsePost({ title, content } = {}) {
  const doc = minidom(`<body>
    <header>${title.rendered}</header>
    <section>${content.rendered}</section>
  </body>`);
  const body = doc.getElementsByTagName('body').item(0);
  const [titleEl, contentEl] = Array.from(body.children);
  return {
    title: getText(titleEl),
    content: getText(contentEl)
  };
}

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
