'use strict';

const debug = require('debug')('http');
const html2text = require('html2plaintext');
const r = require('got');
const qs = require('querystring');
const urlJoin = require('url-join');

const API_URL = 'https://haiku.ist/wp-json/wp/v2/';
const ABOUT = 10;
const HAIKU = 2;

const noop = Function.prototype;
const lazy = getter => ({ enumerable: true, get: getter, set: noop });
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
  return Object.defineProperties({
    createdAt: page.date,
    modifiedAt: page.modified,
    link: normalize(page.link)
  }, parsePost(page));
}

async function count() {
  const query = qs.stringify({ categories: HAIKU });
  const url = urlJoin(API_URL, `/posts?${query}`);
  debug('url:', url);
  const { headers } = await r.head(url);
  return parseInt(headers['x-wp-total'], 10);
}

async function fetchPosts({ pageSize = 10, offset = 0 } = {}) {
  const query = qs.stringify({
    status: 'publish',
    categories: HAIKU,
    per_page: pageSize,
    offset: offset
  });
  const url = urlJoin(API_URL, `/posts?${query}`);
  debug('url:', url);
  const { headers, body = [] } = await r.get(url, { json: true });
  const total = parseInt(headers['x-wp-total'], 10);
  const totalPages = parseInt(headers['x-wp-totalpages'], 10);
  const posts = body.map(it => Object.defineProperties({
    id: it.id,
    createdAt: it.date,
    modifiedAt: it.modified,
    link: normalize(it.link)
  }, parsePost(it)));
  return { total, totalPages, pageSize, posts };
}

function parsePost({ title, content } = {}) {
  return {
    title: lazy(() => html2text(title.rendered)),
    content: lazy(() => html2text(content.rendered))
  };
}

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
