import './notindex.js'
require('./notindex2.js')
import lodash from 'lodash'

document.getElementsByTagName('body')[0].innerHTML += '<div>hacked from index.js</div>'
document.getElementsByTagName('body')[0].innerHTML += `<div>${lodash.join(['hacked', 'from', 'lodash'], ' ')}</div>`
