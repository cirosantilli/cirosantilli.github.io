const fs = require('fs')

export function makeGetStaticProps(isBlue) {
  return () => {
    return { props: {
      fs: Object.keys(fs).join(' '),
      isBlue,
    } }
  }
}
