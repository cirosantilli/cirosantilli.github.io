import Link from 'next/link'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

export default function Post() {
  const router = useRouter()
  const { pid } = router.query
  const routeAsPath = useRouter().asPath
  const [count, setCount] = useState(0)
  const [perPageCount, setPerPageCount] = useState(0)
  useEffect(() => {
    setPerPageCount(0)
  }, [routeAsPath])
  return (<>
    <p>pid: {pid}</p>
    <p>count: {count}</p>
    <p>perPageCount: {perPageCount}</p>
    <p>routeAsPath: {routeAsPath}</p>
    <button
      onClick={(ev) => {
        setCount(c => c + 1)
        setPerPageCount(c => c + 1)
      }}
    >
      count++
    </button>
    <ul>
      <li><Link href="/">Index</Link></li>
      <li><Link href="/1">1</Link></li>
      <li><Link href="/2">2</Link></li>
      <li><Link href="/3">3</Link></li>
    </ul>
  </>)
}
