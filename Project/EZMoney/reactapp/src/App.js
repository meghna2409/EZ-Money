import './App.css';
import { useState } from 'react';
// import GroupButtons from './GroupButtons';

function App() {
  const [data, setData] = useState(null)
  function getData(val) {
    setData(val.target.value)
    console.warn(val.target.value)
  }
  const USD = true;

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <h2>1 {USD ? 'United States Dollar' : 'Euro'} equals</h2>
      <h1> {data} Euro</h1>
      <input type = "number" min="0" step="5" onChange={getData}></input>
      <select>
        <option value = "USD">USD</option>
        <option value = "EUR">EUR</option>
        <option value = "NZD">NZD</option>
        <option value = "AUD">AUD</option>
        <option value = "SGD">SGD</option>
        <option value = "CAD">CAD</option>
        <option value = "CHF">CHF</option>
        <option value = "GBP">GBP</option>
        <option value = "KWD">KWD</option>
      </select>
      <br></br>
      <br></br>
      <input type = "number" min="0" step="5" onChange={getData}></input>
      <select>
        <option value = "USD">USD</option>
        <option value = "EUR">EUR</option>
        <option value = "NZD">NZD</option>
        <option value = "SGD">SGD</option>
        <option value = "CAD">CAD</option>
        <option value = "CHF">CHF</option>
        <option value = "GBP">GBP</option>
        <option value = "KWD">KWD</option>
      </select>
      <br></br>
      <br></br>
    </div>
  );
}

export default App;