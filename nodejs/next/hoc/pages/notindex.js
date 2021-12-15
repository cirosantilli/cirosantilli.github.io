// Client + server code.

import Link from 'next/link'

export default function NotIndexPage(props) {
  return <>
    <Link href="/">
      <a>index</a>
    </Link>
    <div>{props.fs}</div>
    <div>{props.isBlue}</div>
  </>
}

// Server-only code.

import { makeGetStaticProps } from "../lib"

export const getStaticProps = makeGetStaticProps(false)
