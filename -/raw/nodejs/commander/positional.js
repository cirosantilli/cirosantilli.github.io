#!/usr/bin/env node

function myParseInt(value, dummyPrevious) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

const commander = require('commander');
const program = commander.program
program.option('-m --myopt <myopt>', 'doc for myopt', 'myopt-default');
program.argument('<arg1>', 'doc for arg1');
program.argument('<arg2>', 'doc for arg2');
program.argument('[arg3]', 'doc for arg3', myParseInt, 1);
program.allowExcessArguments(false);
program.parse(process.argv);
console.error(program.processedArgs.length);
console.error(program.args);
const [arg1, arg2, arg3] = program.processedArgs
const opts = program.opts()
console.error(`arg1: ${arg1} (${typeof arg1})`);
console.error(`arg2: ${arg2} (${typeof arg2})`);
console.error(`arg3: ${arg3} (${typeof arg3})`);
console.error(`myopt: ${opts.myopt} (${typeof opts.myopt})`);
