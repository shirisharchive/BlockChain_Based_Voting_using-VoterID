let web3;
let contract;

document.addEventListener("DOMContentLoaded", async () => {
  if (window.ethereum) {
    // Initialize Web3
    web3 = new Web3(window.ethereum);

    
    const abi = [
      {
        "inputs": [{ "internalType": "uint256", "name": "_voterID", "type": "uint256" }],
        "name": "registerVoter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const contractAddress = "0x22e5365724f4B50b9F67b632eF14326ACFD13D17"; 
    contract = new web3.eth.Contract(abi, contractAddress);

    console.log("Web3 initialized and contract loaded");
  } else {
    alert("MetaMask is not installed. Please install MetaMask to use this app.");
    console.error("MetaMask not found");
  }
});

async function registerVoter() {
  try {
    // Ensure Web3 is initialized
    if (!web3 || !contract) {
      alert("Web3 is not initialized. Please refresh the page.");
      return;
    }

    // Request MetaMask account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Get the selected account from MetaMask
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // Get the voter ID from the form input
    const voterIdInput = document.getElementById("voterId");
    const voterID = parseInt(voterIdInput.value);

    // Ensure voter ID is valid
    if (isNaN(voterID) || voterID <= 0) {
      alert("Please enter a valid voter ID.");
      return;
    }

    // Call the smart contract function
    await contract.methods.registerVoter(voterID).send({ from: account });
    
    alert(`Voter ID ${voterID} registered successfully.`);
  } catch (error) {
    console.error("Error registering voter:", error);
    alert("Failed to register voter. Please try again.");
  }
}