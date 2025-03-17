import newweb3 from "./newweb3";
import contractABI from "./contABI";
import contractAddr from "./contAddr";
// Initialize Web3 (connect to MetaMask or any Web3 provider)
const myContract = new newweb3.eth.Contract(contractABI, contractAddr);
export default myContract;