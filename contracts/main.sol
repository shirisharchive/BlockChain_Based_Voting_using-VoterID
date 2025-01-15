// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    struct CandidateInfo {
        string name;
        string party;
        string position;
        uint256 voteCount;
    }

    mapping(uint256 => CandidateInfo) public candidates;
    mapping(uint256 => bool) public registeredVoters;
    mapping(uint256 => mapping(string => bool)) public hasVotedForPosition;
    mapping(uint256 => uint256) public voterVotes;  // Mapping to store which candidate a voter voted for
    uint256 public candidateCount;

    // List of registered voter IDs
    uint256[] public registeredVoterIDs;

    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _position
    ) public returns (bool success) {
        for (uint256 i = 0; i < candidateCount; i++) {
            require(
                !(keccak256(abi.encodePacked(candidates[i].position)) == 
                    keccak256(abi.encodePacked(_position)) &&
                    keccak256(abi.encodePacked(candidates[i].party)) == 
                    keccak256(abi.encodePacked(_party))),
                "A candidate from the same party is already running for this position"
            );
        }

        candidates[candidateCount] = CandidateInfo({
            name: _name,
            party: _party,
            position: _position,
            voteCount: 0
        });

        candidateCount++;
        return true;
    }

    function registerVoter(uint256 _voterID) public {
        require(!registeredVoters[_voterID], "This voter is already registered");
        require(_voterID > 0, "Voter ID must be greater than 0");
        registeredVoters[_voterID] = true;
        registeredVoterIDs.push(_voterID); // Add voter ID to the list
    }

    function vote(uint256 voterID, uint256 candidateId) public returns (bool success) {
        require(registeredVoters[voterID], "You are not registered");
        require(candidateId < candidateCount, "Candidate does not exist");

        // Ensure the voter has not voted already for this position
        CandidateInfo storage candidate = candidates[candidateId];
        require(
            !hasVotedForPosition[voterID][candidate.position],
            "You have already voted for this position"
        );

        // Link voter to the candidate they voted for
        voterVotes[voterID] = candidateId;
        hasVotedForPosition[voterID][candidate.position] = true;

        // Increase vote count for the selected candidate
        candidate.voteCount++;
        return true;
    }

    function getCandidate(uint256 candidateId)
        public
        view
        returns (
            string memory name,
            string memory party,
            string memory position,
            uint256 voteCount
        )
    {
        require(candidateId < candidateCount, "Candidate does not exist");

        CandidateInfo memory candidate = candidates[candidateId];
        return (
            candidate.name,
            candidate.party,
            candidate.position,
            candidate.voteCount
        );
    }

    function checkIfVotedForPosition(uint256 voterID, string memory position)
        public
        view
        returns (bool)
    {
        return hasVotedForPosition[voterID][position];
    }

    // New function to get all registered voter IDs
    function getRegisteredVoters() public view returns (uint256[] memory) {
        return registeredVoterIDs;
    }

    // Function to get the candidate ID a specific voter voted for
    function getVoterVote(uint256 voterID) public view returns (uint256) {
        return voterVotes[voterID];
    }
      function getTotalVoterCount() public view returns (uint256) {
        return registeredVoterIDs.length;
    }
}
