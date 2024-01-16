import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Web3 from "web3";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "../App.css";
import img1 from "../images/img1.gif";

// Replace these with your Kaleido blockchain details
const blockchainURL =
  "https://a0qryrotg0-a0h15ae5g5-connect.au0-aws.kaleido.io/";
const contractAddress = "0xc7cbc0431485325c814baf4a5ba699c7b1659775";
const username = "a0cbs09s75";
const password = "LWB7z8Oo8Cs6_I0OjCq9Ep2t-EUDIKYdeIcurOOYwjs";
const nodeAddress = "0x77f7893e545d783d74dc55262884537ec2df6985";
const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Faucet = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const provider = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3Provider(provider);
        } else {
          throw new Error(
            "Please install MetaMask or another Ethereum wallet."
          );
        }
      } catch (error) {
        console.error("Error initializing Web3:", error.message);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (!web3Provider) return;
        const web3 = new Web3(web3Provider);

        if (!contractAddress) {
          throw new Error(
            "Invalid contract address. Please provide a valid address."
          );
        }

        const contractInstance = new web3.eth.Contract(abi, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing contract:", error.message);
      }
    };

    initContract();
  }, [web3Provider]);

  const requestTokens = async () => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized. Please try again.");
      }

      if (!recaptchaValue) {
        throw new Error("Please complete the captcha.");
      }

      if (!web3Provider.utils.isAddress(address)) {
        throw new Error("Please enter a valid Ethereum address.");
      }

      setLoading(true);
      // Set up basic authentication
      const basicAuth = "Basic " + window.btoa(`${username}:${password}`);

      // Set a fixed value of 50 for the amount
      const fixedAmount = 50;

      // Set up the transfer payload with the fixed amount
      const transferPayload = {
        amount: fixedAmount,
        recipient: address,
      };

      // Make the transfer request
      const response = await axios.post(
        `${blockchainURL}/gateways/kaleidoerc20mb/${contractAddress}/transfer`,
        transferPayload,
        {
          headers: {
            Authorization: basicAuth,
          },
          params: {
            "kld-from": nodeAddress,
            "kld-sync": true,
          },
        }
      );

      // Log the entire response to see its structure
      console.log("Response:", response);

      // Check for properties indicating a successful transaction
      if (
        response.data &&
        response.data.blockHash &&
        response.data.blockNumber &&
        response.data.cumulativeGasUsed
      ) {
        console.log("Tokens sent successfully!");
        alert("Tokens sent successfully!");
        // You may want to update the UI or perform additional actions here
      } else {
        throw new Error(
          "Failed to send tokens. Please check the response for more details."
        );
      }
    } catch (error) {
      console.error("Error sending tokens:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceOf = async () => {
    try {
      const basicAuth = "Basic " + window.btoa(`${username}:${password}`);

      const response = await axios.post(
        `${blockchainURL}/gateways/kaleidoerc20mb/${contractAddress}/balanceOf`,
        {
          account: address,
        },
        {
          headers: {
            Authorization: basicAuth,
          },
        }
      );

      const balanceFromResponse = response.data.output;

      console.log("Balance from API response:", balanceFromResponse);

      setBalance(balanceFromResponse);
    } catch (error) {
      console.error("Error getting balance or sending tokens:", error.message);
      alert("Error getting balance or sending tokens. Please try again.");
    }
  };

  return (
    <div className="container">
      <nav className="navbar navbar-dark bg-dark">
        <div className="navbar-brand">
          <h1 className="navbar-item h4">Nanyang Poly Token (NYT)</h1>
        </div>
      </nav>
      <section className="hero bg-light">
        <div className="hero-body">
          <div className="container text-center">
            <h1 className="title display-4">Kaleido Faucet</h1>
            <p className="lead">Fast and reliable. 50 NYT/day.</p>
            <div className="columns">
              <div className="column is-four-fifths"></div>
            </div>
          </div>
        </div>
      </section>
      <div className="form">
        <div className="form-group">
          <img src={img1} alt="dog" height={450} width={450} />
          <label className="form-title" htmlFor="walletAddress">
            Wallet Address
          </label>
          <div className="input-container">
            <input
              id="walletAddress"
              type="text"
              placeholder="Enter your wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="captcha">
          {/* Add reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6LeiTlIpAAAAAO_3FwenURd2jbNcvSJ97QoAV6Pb"
            onChange={(value) => setRecaptchaValue(value)}
          />
        </div>
        <Button
          className="button"
          type="button"
          onClick={requestTokens}
          disabled={loading}
        >
          {loading ? "Sending Tokens..." : "Request Tokens"}
        </Button>

        <Button className="button" type="button" onClick={handleBalanceOf}>
          Get Balance
        </Button>
        <p className="balance-label mt-3">Token Balance:</p>
        <p className="balance">{balance}</p>
      </div>
    </div>
  );
};
export default Faucet;
