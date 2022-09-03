import world from '../world.md'

export default function IndexPage() {
  const what: string = 'my'
  // Would fail on build as desired.
  // const what2: int = 'world2'
  return <div>hello {what} {world}</div>
}
