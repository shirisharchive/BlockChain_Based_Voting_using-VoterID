const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.new();
  });

  it("should add a candidate successfully", async () => {
    const result = await votingInstance.addCandidate("Alice", "Party A", "President");
    assert.isTrue(result.receipt.status, "Candidate was not added successfully");

    const candidate = await votingInstance.getCandidate(0);
    assert.equal(candidate.name, "Alice", "Name does not match");
    assert.equal(candidate.party, "Party A", "Party does not match");
    assert.equal(candidate.position, "President", "Position does not match");
    assert.equal(candidate.voteCount, 0, "Vote count should be zero");
  });

  it("should not allow two candidates from the same party for the same position", async () => {
    await votingInstance.addCandidate("Alice", "Party A", "President");

    try {
      await votingInstance.addCandidate("Bob", "Party A", "President");
      assert.fail("Expected an error but did not get one");
    } catch (err) {
      assert.include(
        err.message,
        "A candidate from the same party is already running for this position",
        "Error message mismatch"
      );
    }
  });

  it("should register a voter successfully", async () => {
    await votingInstance.registerVoter(123);
    const isRegistered = await votingInstance.registeredVoters(123);
    assert.isTrue(isRegistered, "Voter was not registered successfully");
  });

  it("should not allow the same voter to register twice", async () => {
    await votingInstance.registerVoter(123);

    try {
      await votingInstance.registerVoter(123);
      assert.fail("Expected an error but did not get one");
    } catch (err) {
      assert.include(err.message, "This voter is already registered", "Error message mismatch");
    }
  });

  it("should allow a registered voter to vote", async () => {
    await votingInstance.registerVoter(123);
    await votingInstance.addCandidate("Alice", "Party A", "President");

    const result = await votingInstance.vote(123, 0);
    assert.isTrue(result.receipt.status, "Vote was not successful");

    const candidate = await votingInstance.getCandidate(0);
    assert.equal(candidate.voteCount, 1, "Vote count was not incremented");
  });

  it("should not allow an unregistered voter to vote", async () => {
    await votingInstance.addCandidate("Alice", "Party A", "President");

    try {
      await votingInstance.vote(123, 0);
      assert.fail("Expected an error but did not get one");
    } catch (err) {
      assert.include(err.message, "You are not registered", "Error message mismatch");
    }
  });

  it("should not allow a voter to vote twice for the same position", async () => {
    await votingInstance.registerVoter(123);
    await votingInstance.addCandidate("Alice", "Party A", "President");

    await votingInstance.vote(123, 0);

    try {
      await votingInstance.vote(123, 0);
      assert.fail("Expected an error but did not get one");
    } catch (err) {
      assert.include(err.message, "You have already voted for this position", "Error message mismatch");
    }
  });

  it("should check if a voter has voted for a position", async () => {
    await votingInstance.registerVoter(123);
    await votingInstance.addCandidate("Alice", "Party A", "President");

    await votingInstance.vote(123, 0);
    const hasVoted = await votingInstance.checkIfVotedForPosition(123, "President");
    assert.isTrue(hasVoted, "Voter should have voted for this position");
  });
});
