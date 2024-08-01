import React, { Component } from 'react';
import { initWeb3, initContract, getContract, loadBlockchainData, vote, connectMetaMask, getWeb3, checkIfVoted } from '../services/web3Service';
import Candidate from './Candidate';
import Loader from './Loader';
import VotingInfo from './VotingInfo';
import '../App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            candidates: [],
            votingEndTime: 0,
            timeRemaining: 0,
            loading: true,
            winner: null,
            votingEnded: false,
            winnerDeclared: false
        };

        this.vote = this.vote.bind(this);
        this.checkIfVoted = this.checkIfVoted.bind(this);
        this.connectMetaMask = this.connectMetaMask.bind(this);
    }

    async componentDidMount() {
        try {
            await initWeb3();
            await this.loadBlockchainData();
        } catch (error) {
            console.error("Error loading blockchain data:", error);
        }
    }

    async loadBlockchainData() {
        const web3 = getWeb3();
        if (!web3) throw new Error("Web3 is not initialized");

        const contract = initContract();
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });

        try {
            const { candidatesCount, votingEndTime, candidates } = await loadBlockchainData(this.state.account);
            this.setState({ candidatesCount, votingEndTime, candidates });
            this.startTimer();
        } catch (error) {
            console.error("Error fetching data from contract:", error);
        }

        this.setState({ loading: false });
    }

    startTimer() {
        this.timer = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const timeRemaining = Math.max(this.state.votingEndTime - now, 0);
            this.setState({ timeRemaining });

            if (timeRemaining === 0 && !this.state.votingEnded) {
                this.setState({ votingEnded: true });

                setTimeout(() => {
                    this.getWinner();
                }, 2000);
            }
        }, 1000);
    }

    async getWinner() {
        try {
            const contract = getContract();
            if (!contract) throw new Error("Contract is not initialized");
            const winner = await contract.methods.winner().call();
            this.setState({ winner, winnerDeclared: true });
        } catch (error) {
            console.error("Error fetching winner:", error);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    async connectMetaMask() {
        try {
            const account = await connectMetaMask();
            this.setState({ account });
        } catch (error) {
            console.error("Error connecting MetaMask:", error);
        }
    }

    async checkIfVoted() {
        try {
            const hasVoted = await checkIfVoted(this.state.account);
            return hasVoted;
        } catch (error) {
            console.error("Error checking voting status:", error);
            return false;
        }
    }

    async vote(candidateId) {
        this.setState({ loading: true });

        try {
            const hasVoted = await this.checkIfVoted();
            if (hasVoted) {
                alert("Your vote has already been counted!");
                this.setState({ loading: false });
                return;
            }

            await vote(this.state.account, candidateId);
            this.loadBlockchainData();
        } catch (error) {
            this.handleError(error);
        } finally {
            this.setState({ loading: false });
        }
    }

    handleError(error) {
        console.error(error);
        let errorMessage = "An unknown error occurred.";
        if (error.message) {
            if (error.message.includes("You have already voted")) {
                errorMessage = "You have already voted.";
            } else if (error.message.includes("Invalid candidate")) {
                errorMessage = "Invalid candidate selected.";
            } else {
                errorMessage = "Transaction failed. Please try again.";
            }
        }
        alert(`Error: ${errorMessage}`);
    }

    render() {
        const { timeRemaining, votingEnded, winnerDeclared, winner, loading, account, candidates } = this.state;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        return (
            <div className="App">
                <header className="App-header">
                    <h1>DApp Voting</h1>
                    <p>Your account: <strong>{account}</strong></p>
                    <button className="connect-button" onClick={this.connectMetaMask}>
                        {account ? 'Connected' : 'Connect MetaMask'}
                    </button>
                </header>
                <main>
                    {loading
                        ? <Loader />
                        : <div>
                            <VotingInfo
                                timeRemaining={timeRemaining}
                                votingEnded={votingEnded}
                                winner={winner}
                                minutes={minutes}
                                seconds={seconds}
                            />
                            {!votingEnded && (
                                <div className="candidates-list">
                                    {candidates.map((candidate, key) => (
                                        <Candidate
                                            key={key}
                                            candidate={candidate}
                                            vote={this.vote}
                                            votingEnded={votingEnded}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    }
                </main>
            </div>
        );
    }
}

export default App;