import { useState } from 'react'
import './App.css'
import Preloader from "./components/Preloader/Preloader";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div className="container">
        <h1>
          Website
          <br />
          Coming Soon
        </h1>
        <Preloader />
      </div>
    </div>
  )
}

export default App
