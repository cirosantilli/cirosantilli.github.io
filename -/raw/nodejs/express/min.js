#!/usr/bin/env node
// https://cirosantilli.com/express-js
const express = require('express')
const app = express()
app.get('/', (req, res) => {
  res.send('hello world')
})
const server = app.listen(3000)
