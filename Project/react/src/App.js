import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [data, setData] = useState(null)
  function getData(val) {
    setData(val.target.value)
    console.warn(val.target.value)
  }
  return (
    <div className="App">
      <h1>Input</h1>
      <input type = "text" onChange={getData}></input>
      <h1>Output: {data}</h1>
    </div>
  );
}

export default App;
