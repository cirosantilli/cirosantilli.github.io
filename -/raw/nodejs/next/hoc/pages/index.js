// Client + server code.

import { makeIndexPage } from "../lib"

export default makeIndexPage(true)

// Server-only code.

import { makeGetStaticProps } from "../back"

export const getStaticProps = makeGetStaticProps(true)
