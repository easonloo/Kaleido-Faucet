// src/App.js
import React from "react";
import Faucet from "./components/Faucet";


const contractAddress = "0xc7cbc0431485325c814baf4a5ba699c7b1659775";
const web3Provider = "http://localhost:3000"; // e.g., 'http://localhost:8545'

function App() {
  return (
    <div className="App">
      <Faucet contractAddress={contractAddress} web3Provider={web3Provider} />
    </div>
  );
}

export default App;
