
    // Initialize Web3 and connect to Ganache
    const web3 = new Web3('http://127.0.0.1:7545');

    const abi = [
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
        "inputs": [],
        "name": "voterCount",
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
            "name": "",
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
        "name": "vote",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
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
      }
    ];

    const contractAddress = "0x64ade527939281294262534Bbf0f7388195e2E39"; 
     const contract = new web3.eth.Contract(abi, contractAddress);

     async function displayCandidates() {
      try {
        const candidateCount = await contract.methods.candidateCount().call();
        console.log("Total number of candidates:", candidateCount);  // Log candidate count

        const candidatesByPosition = {};

        // Fetch and group candidates by position
        for (let i = 0; i < candidateCount; i++) {
          const candidate = await contract.methods.getCandidate(i).call();

          // Group candidates by position
          if (!candidatesByPosition[candidate.position]) {
            candidatesByPosition[candidate.position] = [];
          }
          candidatesByPosition[candidate.position].push(candidate);
        }

        // Display candidates grouped by position
        const candidateContainer = document.getElementById("candidateContainer");

        for (const position in candidatesByPosition) {
          const positionGroup = candidatesByPosition[position];

          const positionGroupElement = document.createElement("div");
          positionGroupElement.className = "position-group";

          const positionTitle = document.createElement("div");
          positionTitle.className = "position-title";
          positionTitle.textContent = position;
          positionGroupElement.appendChild(positionTitle);

          const candidateRow = document.createElement("div");
          candidateRow.className = "candidate-row";

          positionGroup.forEach(candidate => {
            const candidateElement = document.createElement("div");
            candidateElement.className = "candidate";
            candidateElement.innerHTML = `
              <p>Candidate Name: <strong>${candidate.name}</strong></p>
              <p>Party: ${candidate.party}</p>
              <p>Vote Count: ${candidate.voteCount}</p>
            `;
            candidateRow.appendChild(candidateElement);
          });

          positionGroupElement.appendChild(candidateRow);
          candidateContainer.appendChild(positionGroupElement);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    }

    document.addEventListener("DOMContentLoaded", displayCandidates);