'use strict';

const test = require('tape');
const haikuist = require('./');

test('fetch haikus', async t => {
  t.plan(2);
  const { posts } = await haikuist.fetchPosts();
  const [post] = posts;
  t.ok(posts.length > 0, 'haikus are fetched');
  t.ok(post && post.id, `last haiku: id=${post.id}`);
});

test('fetch latest haiku', async t => {
  t.plan(1);
  const { posts } = await haikuist.fetchPosts();
  const latestPost = await haikuist.fetchLatest();
  t.equals(latestPost.id, posts[0].id, 'latest haiku fetched');
});

test('fetch random haiku', async t => {
  t.plan(4);
  const haiku1 = await haikuist.fetchRandom();
  const haiku2 = await haikuist.fetchRandom();
  const haiku3 = await haikuist.fetchRandom();
  t.ok(haiku1 && haiku1.id, `first haiku fetched: id=${haiku1.id}`);
  t.ok(haiku2 && haiku2.id, `second haiku fetched: id=${haiku2.id}`);
  t.ok(haiku3 && haiku3.id, `third haiku fetched: id=${haiku3.id}`);
  t.not(haiku1.id === haiku2.id === haiku3.id, 'haikus are different');
});

test('fetch about page', async t => {
  t.plan(2);
  const { title, content } = await haikuist.about();
  t.equals(title, 'About', 'about page fetched');
  t.ok(content && content.length > 256, `has content: length=${content.length}`);
});
