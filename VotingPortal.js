let web3;
let votingContract;
let voterID = null; // Store the voter ID after it is set

const contractAddress = "0x22e5365724f4B50b9F67b632eF14326ACFD13D17";
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
    const candidatesByParty = {};

    // Group candidates by party
    for (let i = 0; i < count; i++) {
      const candidate = await votingContract.methods.getCandidate(i).call();
      if (!candidatesByParty[candidate.party]) {
        candidatesByParty[candidate.party] = [];
      }
      candidatesByParty[candidate.party].push({ index: i, ...candidate });
    }

    // Now loop through each party and create rows
    for (let party in candidatesByParty) {
      const partyCandidates = candidatesByParty[party];

      // Create a row for each party
      const row = document.createElement("tr");

      // Add party name as the first cell
      const partyCell = document.createElement("td");
      partyCell.colSpan = 6; // Merge cells across the table width
      partyCell.textContent = `Party: ${party}`;
      row.appendChild(partyCell);
      tableBody.appendChild(row);

      // Create candidate cells for each candidate in this party
      const candidateRow = document.createElement("tr");

      // Loop through candidates in the party and add them as cells in the row
      partyCandidates.forEach((candidate) => {
        const candidateCell = document.createElement("td");
        candidateCell.innerHTML = `
          <b>Name:</b> ${candidate.name}<br>
          <b>Position:</b> ${candidate.position}<br>
          <b>Vote Count:</b> ${candidate.voteCount}<br>
          <button onclick="voteForCandidate(${candidate.index})">Vote</button>
        `;
        candidateRow.appendChild(candidateCell);
      });

      // Append the candidate row
      tableBody.appendChild(candidateRow);
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
