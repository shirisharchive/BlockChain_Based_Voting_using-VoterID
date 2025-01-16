let web3;
let votingContract;
let voterID = null; // Store the voter ID after it is set

const contractAddress = "0x64ade527939281294262534Bbf0f7388195e2E39";
const contractABI = [
 
  {
    "inputs": [],
    "name": "candidateCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "candidateId", "type": "uint256" }
    ],
    "name": "getCandidate",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "party", "type": "string" },
      { "internalType": "string", "name": "position", "type": "string" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "voterID", "type": "uint256" },
      { "internalType": "uint256", "name": "candidateId", "type": "uint256" }
    ],
    "name": "vote",
    "outputs": [
      { "internalType": "bool", "name": "success", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "registeredVoters",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
  },
];

// Initialize Web3
async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    votingContract = new web3.eth.Contract(contractABI, contractAddress);
    await loadCandidates();
  } else {
    alert("Please install MetaMask to use this application.");
  }
}

// Load the list of candidates
async function loadCandidates() {
  const tableBody = document.getElementById("candidateTable").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  try {
    const count = await votingContract.methods.candidateCount().call();

    for (let i = 0; i < count; i++) {
      const candidate = await votingContract.methods.getCandidate(i).call();

      // Create a new row
      const row = document.createElement("tr");

      // Add cells to the row
      row.innerHTML = `
        <td>${i}</td>
        <td>${candidate.name}</td>
        <td>${candidate.party}</td>
        <td>${candidate.position}</td>
        <td>${candidate.voteCount}</td>
        <td><button onclick="voteForCandidate(${i})">Vote</button></td>
      `;

      // Append the row to the table
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }
}

// Function to vote for a candidate
async function voteForCandidate(candidateId) {
  const statusElement = document.getElementById("status");

  if (!voterID) {
    statusElement.textContent = "Please set your Voter ID first!";
    return;
  }

  if (!web3 || !votingContract) {
    statusElement.textContent = "Web3 is not initialized. Please connect to MetaMask.";
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    const tx = await votingContract.methods.vote(voterID, candidateId).send({ from: accounts[0] });
    statusElement.textContent = `Your vote is Successfully registered for ${candidateId} `;

    // Refresh the candidate list to show updated vote counts
    await loadCandidates();
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
  }
}

// Set Voter ID and check registration
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("setVoterID").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    const voterInput = document.getElementById("voterID").value;
    if (!voterInput) {
      alert("Please enter a valid Voter ID!");
      return;
    }

    try {
      voterID = parseInt(voterInput, 10);
      if (isNaN(voterID)) {
        alert("Invalid Voter ID. Please enter a numeric ID.");
        return;
      }

      // Check if the voter is registered
      const isRegistered = await votingContract.methods.registeredVoters(voterID).call();
      if (isRegistered) {
        document.getElementById("status").textContent = `Voter ID set to ${voterID}. You can now cast a vote.`;
      } else {
        voterID = null; // Reset voterID
        document.getElementById("status").textContent = "This Voter ID is not registered.";
        alert("You are not registered as a voter!");
      }
    } catch (error) {
      console.error("Error verifying voter registration:", error);
      alert("An error occurred while verifying your registration. Please try again.");
    }
  });

  initWeb3(); // Initialize Web3 after DOM is ready
});
