import Link from 'next/link'

export function makeIndexPage(isIndex) {
  return (props) => {
    console.error({isIndex});
    return <>
      <Link href={isIndex ? '/notindex' : '/'}>
        <a>{isIndex ? 'notindex' : 'index'}</a>
      </Link>
      <div>{props.fs}</div>
      <div>{props.isBlue}</div>
    </>
  }
}
