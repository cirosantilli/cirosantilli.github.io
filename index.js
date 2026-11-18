#!/usr/bin/env node

// This script patches the OurBigBook library source code to add toplevel_id_clean variable

const fs = require('fs');
const path = require('path');

// Path to the ourbigbook index.js file
const ourbigbookIndexPath = path.join(__dirname, 'node_modules', 'ourbigbook', 'index.js');

// Read the original source
let source = fs.readFileSync(ourbigbookIndexPath, 'utf8');

// Find the line where toplevel_id is assigned and add our variable right after it
// The line is: options.template_vars.toplevel_id = toplevel_id
const originalLine = 'options.template_vars.toplevel_id = toplevel_id';
const patchedLine = `options.template_vars.toplevel_id = toplevel_id
      options.template_vars.toplevel_id_clean = toplevel_id.replace(/\\.html$/, '')`;

if (source.includes(originalLine) && !source.includes('toplevel_id_clean')) {
  source = source.replace(originalLine, patchedLine);
  fs.writeFileSync(ourbigbookIndexPath, source);
}

// Now require and run the original ourbigbook CLI
require('./node_modules/ourbigbook/ourbigbook');