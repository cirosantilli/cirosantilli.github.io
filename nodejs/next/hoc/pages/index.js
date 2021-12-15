// Client + server code.

import Link from 'next/link'

export default function IndexPage(props) {
  return <>
    <Link href="/notindex">
      <a>notindex</a>
    </Link>
    <div>{props.fs}</div>
    <div>{props.isBlue}</div>
  </>
}

export default function IndexPage() {
  return (
    <div>
      Hello World.{' '}
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  )
}

// Server-only code.

import { makeGetStaticProps } from "../lib"

export const getStaticProps = makeGetStaticProps(true)
