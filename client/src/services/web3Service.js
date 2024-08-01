import Web3 from 'web3';
import Voting from '../Voting.json';

let web3;
let contract;

export const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("Ошибка подключения MetaMask:", error);
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    }

    return web3;
};

export const initContract = () => {
    const contractAddress = '0x170C27C04eC16cE33cb51a2172738Bc12472f5f3'; // set contract address
    if (!web3) throw new Error("Web3 is not initialized");
    contract = new web3.eth.Contract(Voting.abi, contractAddress);
    return contract;
};

export const getWeb3 = () => web3;
export const getContract = () => contract;

export const checkIfVoted = async (account) => {
    if (!contract) throw new Error("Contract is not initialized");
    return await contract.methods.hasVoted().call({ from: account });
};

export const connectMetaMask = async () => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    } else {
        throw new Error("MetaMask is not installed.");
    }
};

export const loadBlockchainData = async (account) => {
    if (!contract) throw new Error("Contract is not initialized");
    const candidatesCount = await contract.methods.candidatesCount().call();
    const votingEndTimeTimestamp = await contract.methods.votingEndTime().call();
    const candidates = [];
    for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await contract.methods.candidates(i).call();
        candidates.push(candidate);
    }
    return { candidatesCount, votingEndTime: Number(votingEndTimeTimestamp), candidates };
};

export const vote = async (account, candidateId) => {
    if (!contract) throw new Error("Contract is not initialized");
    await contract.methods.vote(candidateId).send({ from: account });
};
