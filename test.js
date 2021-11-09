#!/usr/bin/env node

const child_process = require("child_process")
const fs = require("fs")
const path = require("path")

function testLoop(topdir, dir, opts) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true })
  for (let dirent of dirents.sort((a, b) => a.name.localeCompare(b.name))) {
    const curPath = path.join(dir, dirent.name)
    const relpath = path.relative(topdir, curPath)
    if (!opts.skip.has(relpath)) {
      if (dirent.isDirectory()) {
        if (
          dirent.name !== 'node_modules' &&
          !testLoop(topdir, curPath, opts)
        ) {
          return false
        }
      } else {
        if (dirent.name !== 'test') {
          let isExec = true
          try {
            fs.accessSync(curPath, fs.constants.X_OK)
          } catch(e) {
            isExec = false
          }
          if (isExec) {
            for (let args of opts.args) {
              let cmd;
              let cmdPrint
              if (opts.pref) {
                cmd = opts.pref[0]
                args = opts.pref.slice(1).concat([relpath]).concat(args)
                cmdPrint = cmd
              } else {
                cmd = curPath
                cmdPrint = relpath
              }
              console.log(([cmdPrint].concat(args)).join(' '))
              const out = child_process.spawnSync(cmd, args);
              if (out.status !== 0) {
                let msg = `error:\n`;
                if (out.stdout !== null) {
                  msg += `stdout: \n${out.stdout.toString('utf8')}\n`;
                }
                if (out.stderr !== null) {
                  msg += `stderr: \n${out.stderr.toString('utf8')}\n`;
                }
                console.log(msg)
                return false
              }
            }
          }
        }
      }
    }
  }
  return true
}

// opts:
//
// * args: string[][]. List of common command line arguments passed to all executables
//                     Each executable runs once with every given set of arguments.
// * pref: string[]. Prefix added to each command to run.
// * skip: string[]. List of paths to skip tests for, usually because they are failing,
//                   or because they are slow.
function test(opts = {}) {
  if (!('args' in opts)) {
    args.opts = [[]]
  }
  const ret = testLoop(process.cwd(), process.cwd(), opts) ? 0 : 1
  process.exit(ret);
}
exports.test = test

if (require.main === module) {
  test()
}
