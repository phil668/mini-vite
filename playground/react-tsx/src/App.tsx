import React, { useState } from 'react'
// import logo from './logo.svg'
import './App.css'
import { union } from "lodash";

function App() {
  const [count, setCount] = useState(0)
  console.log('union',union)
  return (
    <div className="App">
      <header className="App-header">
        {/* <img className="App-logo" src={logo} alt="" /> */}
        <p>Hello Vite + React</p>
        <p>
          <button type="button" onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App</code> and save e test.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
