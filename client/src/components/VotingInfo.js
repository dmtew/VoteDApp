import React from 'react';

const VotingInfo = ({ votingEnded, winner, minutes, seconds }) => (
    <div>
        <div className="timer">
            <p>Time left: {minutes} min {seconds} sec</p>
        </div>
        {votingEnded && winner ? (
            <div className="winner-announcement">
                <h2>Winner: {winner.winnerName}</h2>
                <p>Votes: {Number(winner.winnerVoteCount)}</p>
            </div>
        ) : null}
    </div>
);

export default VotingInfo;
