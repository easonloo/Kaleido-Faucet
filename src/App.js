// src/App.js
import React from "react";
import Faucet from "./components/Faucet";


const contractAddress = "0xa7a41ecc3cf7bc43c1a23962c8eb0f94ab2ba51b";
const web3Provider = "http://localhost:3000"; // e.g., 'http://localhost:8545'

function App() {
  return (
    <div className="App">
      <Faucet contractAddress={contractAddress} web3Provider={web3Provider} />
    </div>
  );
}

export default App;
