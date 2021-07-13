import _ from 'lodash';

import './main.css';
import './main.scss';
import 'normalize.css/normalize.css';
import { notindex_constant } from './notindex.js';
// Not recommended, but works if you need it to.
const { cjs_constant, cjs_func } = require('./cjs.js');

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(
    [
      'Hello',
      'webpack',
      notindex_constant,
      cjs_constant,
      cjs_func(),
    ],
    ' '
  );
  return element;
}

document.body.appendChild(component());
