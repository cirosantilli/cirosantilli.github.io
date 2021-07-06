import _ from 'lodash';

import './main.css';
import './main.scss';
import { notindex_constant } from './notindex.js';

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack', notindex_constant], ' ');
  return element;
}

document.body.appendChild(component());
