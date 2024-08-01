# VoteDApp

VoteDApp is a decentralized voting application built with Solidity for the smart contract and React.js for the frontend. This application allows users to interact with a voting contract deployed on a local Ethereum network.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/)

## Getting Started

Follow these steps to get the project up and running:

### 1. Deploy the Contract

1. Open Ganache and start a new workspace.
2. Compile and deploy the contract to your local Ganache network. You can use tools like Truffle or Hardhat to deploy the contract.

### 2. Update Contract Address

1. After deploying the contract, copy the contract address.
2. Open `client/src/service/web3Service.js` and update the contract address variable with your deployed contract address:

    ```javascript
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    ```

### 3. Update ABI

1. Open `client/src/Voting.json`.
2. Replace the existing ABI with the ABI of your deployed contract.

### 4. Install Dependencies and Start the Frontend

1. Navigate to the `client` directory:

    ```bash
    cd client
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

4. Open your browser and go to `http://localhost:3000`. Make sure your MetaMask is connected to the local Ganache network.

## Usage

Once the application is running, you can interact with the voting contract through the web interface. Make sure you have MetaMask connected to your local Ganache network and have imported some accounts from Ganache.

## License

This repository is licensed under two different licenses:

1. **Smart Contract** (`contracts/Voting.sol`): MIT License. See the header of the contract file for details.
2. **Rest of the Repository**: GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [web3.js](https://web3js.readthedocs.io/)
- [React.js](https://reactjs.org/)
- [Solidity](https://soliditylang.org/)
- [Ganache](https://trufflesuite.com/ganache/)