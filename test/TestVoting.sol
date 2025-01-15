// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";


contract TestVoting {
    Voting voting;

    function beforeEach() public {
        voting = new Voting();
    }

    function testAddCandidate() public {
        bool success = voting.addCandidate("Alice", "Party A", "President");
        Assert.isTrue(success, "Candidate should be added successfully");

        (string memory name, string memory party, string memory position, uint256 voteCount) = voting.getCandidate(0);
        Assert.equal(name, "Alice", "Candidate name should match");
        Assert.equal(party, "Party A", "Candidate party should match");
        Assert.equal(position, "President", "Candidate position should match");
        Assert.equal(voteCount, 0, "Candidate vote count should be 0 initially");
    }

    function testRegisterVoter() public {
        voting.registerVoter(123);
        bool isRegistered = voting.registeredVoters(123);
        Assert.isTrue(isRegistered, "Voter should be registered successfully");
    }

    function testVote() public {
        voting.registerVoter(123);
        voting.addCandidate("Alice", "Party A", "President");

        bool success = voting.vote(123, 0);
        Assert.isTrue(success, "Vote should be successful");

        (, , , uint256 voteCount) = voting.getCandidate(0);
        Assert.equal(voteCount, 1, "Candidate vote count should increase after voting");
    }

    function testVoterCannotVoteTwice() public {
        voting.registerVoter(123);
        voting.addCandidate("Alice", "Party A", "President");

        voting.vote(123, 0);

        try voting.vote(123, 0) {
            Assert.fail("Voter should not be able to vote twice for the same position");
        } catch Error(string memory reason) {
            Assert.equal(reason, "You have already voted for this position", "Error message mismatch");
        }
    }
}
