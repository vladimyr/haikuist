'use strict';

const debug = require('debug')('http');
const html2text = require('html2plaintext');
const r = require('got');
const urlJoin = require('url-join');

const API_URL = 'https://haiku.ist/wp-json/wp/v2/';
const ABOUT = 10;
const HAIKU = 2;

const normalize = url => url.replace(/\/$/, '');

module.exports = {
  about,
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

async function about() {
  const url = urlJoin(API_URL, `/pages/${ABOUT}`);
  debug('url:', url);
  const { body: page = {} } = await r.get(url, { json: true });
  return {
    createdAt: page.date,
    modifiedAt: page.modified,
    link: normalize(page.link),
    ...parsePost(page)
  };
}

async function count() {
  const query = `categories=${HAIKU}`;
  const url = urlJoin(API_URL, `/posts?${query}`);
  debug('url:', url);
  const { headers } = await r.head(url);
  return parseInt(headers['x-wp-total'], 10);
}

async function fetchPosts({ pageSize = 10, offset = 0 } = {}) {
  const query = `categories=${HAIKU}&per_page=${pageSize}&offset=${offset}`;
  const url = urlJoin(API_URL, `/posts?${query}`);
  debug('url:', url);
  const { headers, body = [] } = await r.get(url, { json: true });
  const total = parseInt(headers['x-wp-total'], 10);
  const totalPages = parseInt(headers['x-wp-totalpages'], 10);
  const posts = body.map(it => ({
    id: it.id,
    createdAt: it.date,
    modifiedAt: it.modified,
    link: normalize(it.link),
    ...parsePost(it)
  }));
  return { total, totalPages, pageSize, posts };
}

function parsePost({ title, content } = {}) {
  title = html2text(title.rendered);
  content = html2text(content.rendered);
  return { title, content };
}

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
