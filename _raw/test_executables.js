#!/usr/bin/env node

const child_process = require("child_process")
const fs = require("fs")
const path = require("path")

function testLoop(topdir, fileOrDir, opts) {
  let dirents;
  let dir
  if (fs.lstatSync(fileOrDir).isDirectory()) {
    dir = fileOrDir
    dirents = fs.readdirSync(fileOrDir, { withFileTypes: true })
  } else {
    dirents = [{
      name: path.basename(fileOrDir),
      isDirectory: () => false,
    }]
    dir = path.dirname(fileOrDir)
  }
  for (let dirent of dirents.sort((a, b) => a.name.localeCompare(b.name))) {
    const curPath = path.join(dir, dirent.name)
    const relpath = path.relative(process.cwd(), curPath)
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
            let relpathArgsSkip = opts.argsSkip[relpath]
            if (relpathArgsSkip === undefined) {
              relpathArgsSkip = new Set()
            }
            let argsList;
            if (relpath in opts.args) {
              argsList = opts.args[relpath]
            } else if (opts.argsCommon !== undefined) {
              argsList = opts.argsCommon
            } else {
              argsList = [[]]
            }
            for (let i = 0; i < argsList.length; i++) {
              let args = argsList[i]
              if (!relpathArgsSkip.has(JSON.stringify(args))) {
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
  }
  return true
}

// Test all executables under a given directory recursively.
//
// opts:
//
// * argsCommon: string[][]. List of common command line arguments passed to all executables
//                     Each executable runs once with every given set of arguments.
// * args: {string: string[][]}. List of command line arguments passed to the chosen executable.
//                     That executable runs once with every given set of arguments given.
//                     This option overrides argsCommon for the selected paths.
// * argsSkip: {strig: string[][]}: don't run given executables with the given arg lists
//                     This can be used to skip certain argsCommon choices on certain executables.
// * argv: string[][]. process.argv of the ./test command. Elements:
//                     - 0: toplevel file or directory. If not given, use cwd.
// * pref: string[]. Prefix added to each command to run.
// * skip: string[]. List of paths to skip tests for, usually because they are failing,
//                   or because they are slow.
function test(opts = {}) {
  if (!('argsCommon' in opts)) {
    opts.argsCommon = [[]]
  }
  if (!('argsSkip' in opts)) {
    opts.argsSkip = {}
  }
  for (let relpath in opts.argsSkip) {
    const argsSkip = new Set()
    const argsSkipRelpath = opts.argsSkip[relpath]
    for (let args of argsSkipRelpath) {
      argsSkip.add(JSON.stringify(args))
    }
    opts.argsSkip[relpath] = argsSkip
  }
  if (!('argv' in opts)) {
    opts.argv = []
  }
  let toplevel;
  if (opts.argv.length > 2) {
    toplevel = path.resolve(opts.argv[2])
  } else {
    toplevel = process.cwd()
  }
  const ret = testLoop(toplevel, toplevel, opts) ? 0 : 1
  process.exit(ret);
}
exports.test = test

if (require.main === module) {
  test()
}
