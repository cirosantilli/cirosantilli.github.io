// A simple external Js dependency.
import _ from 'lodash'

// A simple external CSS dependency.
import 'normalize.css/normalize.css'

// A more complex external Js + CSS dependency.
import 'katex/dist/katex.css'
import katex from 'katex'

// Internal dependencies.
import './main.css'
import './main.scss'
import { notindex_constant } from './notindex.js'
// require is not recommended, but also works if you need it to.
const { cjs_constant, cjs_func } = require('./cjs.js')

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(
    [
      'Hello',
      'webpack',
      notindex_constant,
      cjs_constant,
      cjs_func(),
      katex.renderToString('\\frac{1}{\\sqrt{2}}')
    ],
    ' '
  );
  return element;
}

document.body.appendChild(component());

// exports will be usable from the browser, see libraryTarget
// in webpack.common.js.
export const my_exported_var = 'my_exported_var_value';
