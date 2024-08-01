import React from 'react';

const Candidate = ({ candidate, vote, votingEnded }) => (
    <div className="candidate">
        <p className="candidate-name">{candidate.name}</p>
        <p className="candidate-voteCount">{Number(candidate.voteCount)} votes</p>
        <button
            className="vote-button"
            onClick={() => vote(candidate.id)}
            disabled={votingEnded}
        >
            Vote
        </button>
    </div>
);

export default Candidate;
