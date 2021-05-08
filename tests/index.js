
const getTree = require('..');

const log = x => (console.log(JSON.stringify(x)), JSON.stringify(x));

console.assert(log(getTree('.')) ===
    '{"a":{"ab":{"abc":{":e?.js":null,"d.loading.js":null,"d.py":null},"abe.js":null}},"b":{"bc":{"a.js":null}},"index.js":null}');

console.assert(log(getTree('.', { includeFiles: false })) === '{"a":{"ab":{"abc":{}}},"b":{"bc":{}}}');

console.assert(log(getTree('.', { extensions: '.py' })) === '{"a":{"ab":{"abc":{"d.py":null}}}}');

console.assert(log(getTree('.', { ignoreExtensions: '.js' })) === '{"a":{"ab":{"abc":{"d.py":null}}}}');

console.assert(log(getTree('.', { ignoreFolders: 'ab' })) === '{"b":{"bc":{"a.js":null}},"index.js":null}');
