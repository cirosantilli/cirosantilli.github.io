// Client + server code.

import { makeIndexPage } from "../lib"

export default makeIndexPage(false)

// Server-only code.

import { makeGetStaticProps } from "../back"

export const getStaticProps = makeGetStaticProps(false)
