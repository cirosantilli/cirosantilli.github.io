import Link from 'next/link'
import React from 'react'

export default function IndexPage() {
  console.error('IndexPage');
  let [n, setN] = React.useState(0)
  React.useEffect(() => {
    console.error('useEffect');
    setN(parseInt(localStorage.getItem('n') || '0', 10))
  }, [])
  return <>
    <Link href="/notindex">notindex</Link>
    <div
      onClick={() => {
        localStorage.setItem('n', n + 1)
        setN(n + 1)
      }}
    >increment</div>
    <div
      onClick={() => {
        localStorage.removeItem('n')
        setN(0)
      }}
    >reset</div>
    <div>{n}</div>
  </>
}
