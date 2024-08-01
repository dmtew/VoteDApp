// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;

    uint public votingEndTime;

    event votedEvent(uint indexed _candidateId);

    constructor(uint _durationMinutes) {
        addCandidate("Petr Cech");
        addCandidate("Iker Casillas");
        addCandidate("Gianluigi Buffon");
        addCandidate("Oliver Kahn");

        votingEndTime = block.timestamp + _durationMinutes * 1 minutes;
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function hasVoted() public view returns (bool) {
        return voters[msg.sender];
    }

    function vote(uint _candidateId) public {
        require(block.timestamp < votingEndTime, "Voting has ended.");

        require(!voters[msg.sender], "You have already voted.");

        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }

    function hasVotingEnded() public view returns (bool) {
        return block.timestamp >= votingEndTime;
    }

    function winner() public view returns (string memory winnerName, uint winnerVoteCount) {
        require(block.timestamp >= votingEndTime, "Voting has not ended yet.");

        uint winningVoteCount = 0;
        uint winningCandidateId = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        if (winningCandidateId == 0) {
            winnerName = "";
            winnerVoteCount = 0;
        } else {
            winnerName = candidates[winningCandidateId].name;
            winnerVoteCount = candidates[winningCandidateId].voteCount;
        }
    }
}
