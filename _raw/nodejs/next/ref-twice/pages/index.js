import { useState, useRef, useEffect } from 'react'

function complexExternalLibraryFunctionWithoutCleanup(elem, cb) {
  elem.addEventListener('click', () => {
    cb()
  })
}

export default function IndexPage() {
  const [text, setText] = useState('')
  const [myint, setMyint] = useState(0)
  const ref = useRef(null)
  function incIt() {
    setMyint(i => i+1)
  }
  useEffect(() => {
    if (ref.current) {
      const div = document.createElement('div')
      ref.current.appendChild(div)
      complexExternalLibraryFunctionWithoutCleanup(div, incIt)
    }
  }, [])
  return <div>
    <div><input value={text} onChange={e => setText(e.target.value)} placeholder='Type here' /></div>
    <div>You typed: {text}</div>
    <div><button ref={ref}>Click me after typing something! If unfixed, it will increment twice!</button></div>
    <div><button onClick={incIt}>Click me to increment!</button></div>
    <div>{myint}</div>
  </div>
}
