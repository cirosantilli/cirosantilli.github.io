import Link from 'next/link'

export function makeIndexPage(isIndex) {
  return (props) => {
    return <>
      <Link href={isIndex ? '/index' : '/notindex'}>
        <a>{isIndex ? 'index' : 'notindex'}</a>
      </Link>
      <div>{props.fs}</div>
      <div>{props.isBlue}</div>
    </>
  }
}
