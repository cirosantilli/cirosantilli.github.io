#!/usr/bin/env node

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

let args
const commander = require('commander');
const program = commander.program
program.option('-m --myopt <myopt>', 'doc for myopt');
program.argument('<arg1>', 'doc for arg1');
program.argument('<arg2>', 'doc for arg2');
program.argument('[arg3]', 'doc for arg3', myParseInt, 1);
program.action((..._args) => { args = _args })
program.parse(process.argv);
//console.error(program.args);
//console.error(args);
const [arg1, arg2, arg3] = args
const opts = program.opts()
console.error(arg1);
console.error(arg2);
console.error(arg3);
console.error(opts.myopt);
