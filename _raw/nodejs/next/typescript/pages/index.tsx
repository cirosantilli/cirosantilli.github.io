export default function IndexPage() {
  const what: string = 'world'
  // Would fail on build as desired.
  // const what2: int = 'world2'
  return <div>hello {what} {world}</div>
}
