import Link from 'next/link'
import { useRouter } from 'next/router'

import { useState } from 'react'

export default function Post() {
  const router = useRouter()
  const {pid} = router.query
  const [count, setCount] = useState(0)
  return (<>
    <p>pid: {pid}</p>
    <p>count: {count}</p>
    <button
      onClick={(ev) => {
        setCount(c => c + 1)
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
