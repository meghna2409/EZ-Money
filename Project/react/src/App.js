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
      <input type = "number" onChange={getData}></input>
      <select>
        <option value = "USD">USD</option>
        <option value = "EUR">EUR</option>
        </select>
      <h1>Output</h1>
      <label>
        {data} {" "}  
      <select>
        <option value = "USD">USD</option>
        <option value = "EUR">EUR</option>
        </select>
      </label>
    </div>
  );
}

export default App;
