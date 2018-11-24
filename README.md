# haikuist [![build status](https://badgen.net/travis/vladimyr/haikuist/master)](https://travis-ci.com/vladimyr/haikuist) [![install size](https://badgen.net/packagephobia/install/haikuist)](https://packagephobia.now.sh/result?p=haikuist) [![npm package version](https://badgen.net/npm/v/haikuist)](https://npm.im/haikuist) [![github license](https://badgen.net/github/license/vladimyr/haikuist)](https://github.com/vladimyr/haikuist/blob/master/LICENSE) [![js semistandard style](https://badgen.net/badge/code%20style/semistandard/cyan)](https://github.com/Flet/semistandard)

> Fetch haikus from <https://haiku.ist> from your terminal

## Installation

    $ npm install -g haikuist

Or for a one-time run:

    $ npx haikuist

## Usage

    $ haikuist --help

    haikuist v1.0.0

    Usage:
      $ haikuist [command]
      $ haikuist latest     Fetch latest haiku
      $ haikuist about      Display contents of about page

    Options:
      --info         Display https://haiku.ist/about page                [boolean]
      -h, --help     Show help                                           [boolean]
      -v, --version  Show version number                                 [boolean]

    Homepage:     https://github.com/vladimyr/haikuist
    Report issue: https://github.com/vladimyr/haikuist/issues

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [about](#about)
-   [count](#count)
-   [fetchPosts](#fetchposts)
    -   [Parameters](#parameters)
-   [fetchLatest](#fetchlatest)
-   [fetchRandom](#fetchrandom)
-   [Page](#page)
-   [Post](#post)
-   [Response](#response)

### about

Retrieve contents of [haiku.ist/about](https://haiku.ist/about/) page.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Page](#page)>** _About page._

### count

Get total number of haikus.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>** _Total number of haikus available._

### fetchPosts

Retrieve multiple haikus from [haiku.ist](https://haiku.ist) archive.

#### Parameters

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** WordPress REST API `/posts` endpoint
                             [arguments](https://developer.wordpress.org/rest-api/reference/posts/#arguments).
    -   `options.pageSize` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum number of items to be returned in result set. (optional, default `10`)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Response](#response)>** _Paginated listing of posts._

### fetchLatest

Fetch latest haiku.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Post](#post)>** _Latest post containing haiku._

### fetchRandom

Fetch random haiku from [haiku.ist](https://haiku.ist) archive.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Post](#post)>** _Random post containing haiku._

### Page

-   **See: <https://www.npmjs.com/package/wp-api-client#item>**

WordPress API client `Page` response type.

Type: WordPressClient.Item

### Post

-   **See: <https://www.npmjs.com/package/wp-api-client#item>**

WordPress API client `Post` response type.

Type: WordPressClient.Item

### Response

-   **See: <https://www.npmjs.com/package/wp-api-client#response>**

WordPress API client response type used for paginated responses.

Type: WordPressClient.Response
