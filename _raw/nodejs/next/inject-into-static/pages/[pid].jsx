import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { createRoot, hydrateRoot } from 'react-dom/client'
import ReactDOM from 'react-dom'
import { useRouter } from 'next/router'

import { parse } from 'node-html-parser'

function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount)
  return <button
    onClick={() => setCount(i => i+1)}>Click me! {count}</button>
}

const SERVER_HTML_SELECTOR = '.second'

export default function IndexPage({ initialCount, serverHtml }) {
  const router = useRouter()
  const routeAsPath = useRouter().asPath
  const clientHtmlElem = useRef(null)
  const serverHtmlElem = parse(serverHtml)
  serverHtmlElem.querySelector(SERVER_HTML_SELECTOR).innerHTML = renderToString(<Counter {...{ initialCount }} />)
  useEffect(() => {
    if (clientHtmlElem.current) {
      const secondElem = clientHtmlElem.current.querySelector(SERVER_HTML_SELECTOR)
      const div = document.createElement('div')
      const root = createRoot(div)
      root.render(<Counter {...{ initialCount }} />)
      secondElem.replaceChildren(div)
      // Warning: You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it.
      //root.hydrateRoot(
      //  secondElem,
      //  <Counter {...{ initialCount }} />
      //)
      // Hide hack.
      //secondElem.firstChild.style.display = 'none'
      return () => {
        // Hide hack.
        //secondElem.firstChild.style.display = 'visible'
        // Warning: Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition
        //root.unmount()
        // Doesn't seem to make a difference. But why not? React tends to like when we leave DOM nodes unchanged.
        secondElem.replaceChildren()
      }
    }
  }, [initialCount])
  return <div>
    <div>Direct from React</div>
    <div
      dangerouslySetInnerHTML={{ __html: serverHtmlElem.outerHTML }}
      ref={clientHtmlElem}
    />
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/1">1</Link></li>
      <li><Link href="/2">2</Link></li>
      <li><Link href="/3">3</Link></li>
    </ul>
  </div>
}

export const getServerSideProps = async ({ params = {}, req, res }) => {
  return {
    props: {
      // This would be dynamically fetched from the database in the actual usage.
      initialCount: Number(params.pid) * 10,
      serverHtml: `<div>
<div class="first">I'm filled</div>
<div class="second"></div>
<div class="third">I'm also filled</div>
</div>
`,
    }
  }
}
