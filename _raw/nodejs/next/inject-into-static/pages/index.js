import Link from 'next/link'

export default function IndexPage() {
  return <ul>
    <li><Link href="/1">1</Link></li>
    <li><Link href="/2">2</Link></li>
    <li><Link href="/3">3</Link></li>
  </ul>
}
