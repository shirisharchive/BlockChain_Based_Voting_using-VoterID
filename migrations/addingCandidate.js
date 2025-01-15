const web3 = new Web3('http://127.0.0.1:7545');
const abi =  [
    {
      "inputs": [],
      "name": "candidateCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "party",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "position",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "hasVotedForPosition",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "registeredVoterIDs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "registeredVoters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voterVotes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_party",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_position",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_voterID",
          "type": "uint256"
        }
      ],
      "name": "registerVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "voterID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidateId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "candidateId",
          "type": "uint256"
        }
      ],
      "name": "getCandidate",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "party",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "position",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "voterID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "position",
          "type": "string"
        }
      ],
      "name": "checkIfVotedForPosition",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getRegisteredVoters",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "voterID",
          "type": "uint256"
        }
      ],
      "name": "getVoterVote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
const contractAddress = "0xaB95E0C7c0d8D12d7C7e8351D9DE6ADd151D5d6e";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("candidateForm");
    const messageDiv = document.getElementById("message");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const name = document.getElementById("name").value;
      const party = document.getElementById("party").value;
      const position = document.getElementById("position").value;
  
      if (!window.ethereum) {
        alert("No Ethereum provider found. Please install MetaMask!");
        return;
      }
  
      const web3 = new Web3(window.ethereum);
  
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
  
        const contract = new web3.eth.Contract(abi, contractAddress);
  
        messageDiv.textContent = "Adding candidate...";
        const transaction = await contract.methods.addCandidate(name, party, position).send({
          from: account
        });
  
        if (transaction.status) {
          messageDiv.textContent = `Candidate "${name}" added successfully!`;
          form.reset();
        } else {
          messageDiv.textContent = `Failed to add candidate "${name}".`;
        }
      } catch (error) {
        console.error("Error adding candidate:", error);
        alert( 'Error: A candidate from the same party is already running for this position');
        messageDiv.textContent = `${position} positon is already being occupied by candidate ${name} from the same Party ${party}`;
      }
    });
  });
  