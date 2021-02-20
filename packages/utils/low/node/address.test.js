var assert = require('assert')
var parse  = require('./lib/index').parseAddress

describe('Parse address', function() {
  function addTest(what, proto, host, port) {
    it(what, function() {
      if (proto === null) {
        assert.strictEqual(parse(what), null)
      } else if (port) {
        assert.deepEqual(parse(what), {
          proto: proto,
          host: host,
          port: port,
        })
      } else {
        assert.deepEqual(parse(what), {
          proto: proto,
          path: host,
        })
      }
    })
  }

  addTest('9000', 'http', 'localhost', '9000')
  addTest(':9000', 'http', 'localhost', '9000')
  addTest('blah:9000', 'http', 'blah', '9000')
  addTest('http://:9000', 'http', 'localhost', '9000')
  addTest('https::9000', 'https', 'localhost', '9000')
  addTest('https:blah:9000', 'https', 'blah', '9000')
  addTest('https://blah:9000/', 'https', 'blah', '9000')
  addTest('[::1]:9000', 'http', '::1', '9000')
  addTest('https:[::1]:9000', 'https', '::1', '9000')

  addTest('unix:/tmp/foo.sock', 'http', '/tmp/foo.sock')
  addTest('http:unix:foo.sock', 'http', 'foo.sock')
  addTest('https://unix:foo.sock', 'https', 'foo.sock')

  addTest('blah', null)
  addTest('blah://9000', null)
  addTest('https://blah:9000///', null)
  addTest('unix:1234', 'http', 'unix', '1234') // not unix socket
})
