#!/usr/bin/env node

'use strict';

const { about, fetchLatest, fetchRandom } = require('./');
const argv = require('minimist')(process.argv.slice(2));
const bold = require('ansi-bold');
const cyan = require('ansi-cyan');
const green = require('ansi-green');
const html2text = require('html2plaintext');
const locale = require('os-locale').sync().replace('_', '-');
const pkg = require('./package.json');
const wrapAnsi = require('wrap-ansi');

const DATE = '\uD83D\uDCC5';
const OPEN_BOOK = '\uD83D\uDCD6';

const name = Object.keys(pkg.bin)[0];
const isMacOS = process.platform === 'darwin';

const flag = (argv, short, long) => ({ [long]: (short && argv[short]) || argv[long] });

const formatDate = timestamp => (new Date(timestamp)).toLocaleDateString(locale);
const normalize = url => url.replace(/\/$/, '');
const date = timestamp => (isMacOS ? DATE : '@') + ' ' + formatDate(timestamp);
const link = url => (isMacOS ? `${OPEN_BOOK} ` : '') + cyan(normalize(url));
const removeBlankLines = str => str.replace(/(?:\r?\n)+/g, '\n');

const format = haiku => wrap(`
${bold(html2text(haiku.title))}

${removeBlankLines(html2text(haiku.content))}

${date(haiku.createdAt)}
${link(haiku.link)}
`);

const help = `
  ${bold(name)} v${pkg.version}

  Usage:
    $ ${name} [command]
    $ ${name} latest     Fetch latest haiku
    $ ${name} about      Display contents of about page

  Options:
    --info         Display https://haiku.ist/about page                [boolean]
    -h, --help     Show help                                           [boolean]
    -v, --version  Show version number                                 [boolean]

  Homepage:     ${green(pkg.homepage)}
  Report issue: ${green(pkg.bugs.url)}
`;

(async function program(options = getOptions(argv)) {
  const {
    command,
    info: showInfo,
    version: showVersion,
    help: showHelp
  } = options;

  if (showVersion) return console.log(pkg.version);
  if (showHelp) return console.log(help);

  if (showInfo || command === 'about') {
    const info = await about();
    return console.log(format(info));
  }

  const haiku = await ((command === 'latest') ? fetchLatest() : fetchRandom());
  console.log(format(haiku));
}());

function getOptions(argv) {
  const [command] = argv._;
  return {
    ...flag(argv, 'h', 'help'),
    ...flag(argv, 'v', 'version'),
    ...flag(argv, null, 'info'),
    command: (command || '').toLowerCase()
  };
}

function wrap(text, { columns = 80, ...options } = {}) {
  columns = Math.min(process.stdout.columns, columns);
  return wrapAnsi(text, columns, { hard: true, ...options });
}
