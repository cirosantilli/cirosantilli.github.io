#!/usr/bin/env node

// https://cirosantilli.com/express-js

const assert = require('assert')
const http = require('http')

const express = require('express')

// Test it.
function test(port, path, method, status, resBodyExpect, reqBody) {
  const options = {
    hostname: 'localhost',
    port,
    path,
    method,
  }
  const req = http.request(options, res => {
    console.log([path, method, status, resBodyExpect]);
    assert.strictEqual(res.statusCode, status);
    res.on('data', d => {
      if (resBodyExpect !== undefined) {
        assert.strictEqual(d.toString(), resBodyExpect);
      }
    })
  })
  if (reqBody !== undefined) {
    req.write(reqBody)
  }
  req.end()
}

function check_helper(req, res) {
  if (req.params.param.length > 2) {
    res.status(404)
    res.send('ko')
  } else {
    return req.params.param + 'ok'
  }
}

const tests = [
  ['/hello', 'GET', 200, 'hello world'],
  ['/', 'POST', 404],
  ['/form', 'GET', 200],
  // TODO lazy
  // Need to set headers as well likely.
  // https://nodejs.dev/learn/make-an-http-post-request-using-nodejs
  //['/form', 'POST', 200, 'aa: 00 bb: 11', 'aa=00&bb=11'],
  ['/dontexist', 'GET', 404],

  ['/query?aa=000&bb=111', 'GET', 200, 'aa: 000 bb: 111'],
  // Repeated params becomes lists instead of strings. Type safety is for the weak.
  // https://stackoverflow.com/questions/24059773/correct-way-to-pass-multiple-values-for-same-parameter-name-in-get-request
  ['/query?aa=000&aa=111', 'GET', 200, 'aa: 000,111 bb: undefined'],

  // https://stackoverflow.com/questions/10020099/express-js-routing-optional-splat-param
  // https://stackoverflow.com/questions/16829803/express-js-route-parameter-with-slashes
  // https://stackoverflow.com/questions/34571784/how-to-use-parameters-containing-a-slash-character
  ['/splat/aaa', 'GET', 200, 'splat aaa'],
  ['/splat/aaa/bbb', 'GET', 200, 'splat aaa/bbb'],
  ['/splat/aaa/bbb/ccc', 'GET', 200, 'splat aaa/bbb/ccc'],

  ['/check-helper-1/aa', 'GET', 200, 'aaok'],
  ['/check-helper-2/bb', 'GET', 200, 'bbok'],
  ['/check-helper-1/ccc', 'GET', 404, 'ko'],
  ['/check-helper-2/ddd', 'GET', 404, 'ko'],

  // Shows stack traceon terminal.
  ['/error', 'GET', 500],

  // Shows stack traceon terminal.
  ['/error/custom-handler', 'GET', 500],

  // The default errot handler inspects the .status
  // property of the error. 4xx and 5xx are kept.
  // everything else is replaced with 500.
  //
  // With NODE_ENV=production however
  // it is coded  to omit stack traces,
  // and show just the error name.
  ['/error/code/404', 'GET', 404],
  ['/error/code/505', 'GET', 505],
  ['/error/code/606', 'GET', 500],
]

const app = express()
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send(`<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<title>Min sane</title>
</head>
<body>
<ul>
${tests.filter(t => t[1] === 'GET').map(t => `<li><a href="${t[0]}">${t[0]}</a></li>`).join('\n')}
</ul>
</body>
</html>
`)
})
app.get('/hello', (req, res) => {
  res.send('hello world')
})
app.get('/form', (req, res) => {
  res.send(`<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<title>Min sane</title>
</head>
<body>
<form action="/form" method="post">
  <input type="text" name="aa" placeholder="aa"><br>
  <input type="text" name="bb" placeholder="bb"><br>
  <input type="submit" value="Submit">
</form>
</body>
</html>
`)
})
app.post('/form', (req, res) => {
  // Requires the middleware:
  // app.use(express.urlencoded
  console.error(req.body);
  res.send(`aa: ${req.body.aa} bb: ${req.body.bb}`)
})
app.get('/check-helper-1/:param', (req, res) => {
  const ret = check_helper(req, res)
  if (ret) {
    res.send(ret)
  }
})
app.get('/check-helper-2/:param', (req, res) => {
  const ret = check_helper(req, res)
  if (ret) {
    res.send(ret)
  }
})
app.get('/query', (req, res) => {
  res.send(`aa: ${req.query.aa} bb: ${req.query.bb}`)
})
app.get('/splat/:splat(*)', (req, res) => {
  res.send('splat ' + req.params.splat)
})

// Error cases.
app.get('/error', async (req, res, next) => {
  try {
    asdfqwer
  } catch(error) {
    next(error);
  }
})
app.get('/error/code/:param', async (req, res, next) => {
  try {
    throw {
      status: parseInt(req.params.param, 10),
      stack: `fake stack ${req.params.param}`
    }
  } catch(error) {
    next(error);
  }
})
app.get('/error/custom-handler',
  async (req, res, next) => {
    try {
      asdfqwer
    } catch(error) {
      next(error);
    }
  },
  async (err, req, res, next) => {
    res.locals.msg = ['Custom handler']
    next(err)
  },
  async (err, req, res, next) => {
    res.locals.msg.push('Custom handler 2')
    res.status(500).send(res.locals.msg.join('\n'))
    // If we did next() here again, it falls down
    // to the default handler.
    //next(err)
  }
)

app.listen(3000, function () {
  const port = this.address().port
  console.log(`listening: http://localhost:${port}`)
  for (let atest of tests) {
    console.error(atest);
    test(port, ...atest)
  }
})
