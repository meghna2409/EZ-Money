import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Message } from 'semantic-ui-react'
import styled from 'styled-components';
import CurrencyRow from './CurrencyRow'
const Button = styled.button`
  background-color: #3939ab;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: #283593;
  }
`

function click() {
  alert("clicked");
}
function App() {
//   const [data, setData] = useState(null)
//   function getData(val) {
//     setData(val.target.value)
//     console.warn(val.target.value)
//   }
//   // const USD = true;
//   // // get the most recent exchange rates via the "live" endpoint:
//   // // set endpoint and your access key
//   // const endpoint = 'live';
//   // const access_key = '245fcf7139eca8df2a3bae575321e777';
//   // const format = '1';
//   // var jsonData = "hello";
//   // jsonData = $.get('http://api.currencylayer.com/' + endpoint + '?access_key=' + access_key + '&format=' + format, function(data) { 
//   // })
//   // var myData = useRef(jsonData);
//   // alert(jsonData);
//   var d;
//   useEffect(() => {
//     fetch('http://api.currencylayer.com/live?access_key=245fcf7139eca8df2a3bae575321e777%27')
//       // .then(res => res.json())
//       .then(data => d = JSON.stringify(data))
//   }, [])
//   alert(d)
//   // JSON.stringify()?
//   return (
//     <div className="App">
//       <h1>Currency Converter</h1>
//       <h2>1 {USD ? 'United States Dollar' : 'Euro'} equals</h2>
//       <h1> {data} Euro</h1>
//       <input type = "number" min="0" step="5" onChange={getData}></input>
//       <select>
//         <option value = "USD">USD</option>
//         <option value = "EUR">EUR</option>
//         <option value = "NZD">NZD</option>
//         <option value = "AUD">AUD</option>
//         <option value = "SGD">SGD</option>
//         <option value = "CAD">CAD</option>
//         <option value = "CHF">CHF</option>
//         <option value = "GBP">GBP</option>
//         <option value = "KWD">KWD</option>
//       </select>
//       <br></br>
//       <br></br>
//       <input type = "number" min="0" step="5" onChange={getData}></input>
//       <select>
//         <option value = "USD">USD</option>
//         <option value = "EUR">EUR</option>
//         <option value = "NZD">NZD</option>
//         <option value = "SGD">SGD</option>
//         <option value = "CAD">CAD</option>
//         <option value = "CHF">CHF</option>
//         <option value = "GBP">GBP</option>
//         <option value = "KWD">KWD</option>
//       </select>
//       <br></br>
//       <br></br>
//       <Button onClick={click}>
//         Convert
//       </Button>
//       {/* <div ref={jsonData}></div> */}
//     </div>
//   );
// }
  const BASE_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=844fdf07d74d23e41223ca0e2fcee510'
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}&base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <div className="banner">
        <div>
          <h1 className="title"> EZMoney </h1>
          <h4 className="title-text"> kyu || aden || youngbo || meghna || eesha </h4>
          <h3 className="title-text"> <i> ~ serving you real time currency exchange ~ </i> </h3>
        </div>  
      </div>
      <h1 className="title-text-2">Convert</h1>

      <Message className="message">
        <Message.Header> <b>How to Use Our Feature </b></Message.Header>
        <Message.List>
          <p>Toggle the dropdown menus to convert between any two currencies. For more specific conversions, feel free to 
            input a specific amount and the conversion will occur instantaneously.
          </p>
        </Message.List>
      </Message>

      <div className="row">
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="title-text-2">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      </div>
    </>
  );
}

export default App;