import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";

const AdminRegister = () => {
    const navigate = useNavigate();

    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [name, setName] = useState("");
    const [college, setCollege] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = AttendanceSystem.networks[networkId];

                if (deployedNetwork) {
                    const instance = new web3.eth.Contract(
                        AttendanceSystem.abi,
                        deployedNetwork.address
                    );
                    setContract(instance);
                } else {
                    console.error("Smart contract not deployed to detected network.");
                }
            } else {
                console.error("Please install MetaMask.");
            }
        };

        loadBlockchainData();
    }, []);

    const registerAdmin = async () => {
        if (contract && account) {
            try {
                await contract.methods.registerAdmin(name, college).send({ from: account });
                setMessage("Admin registered successfully!");
                navigate("/login");
            } catch (error) {
                setMessage("Registration failed. Ensure you are not already registered.");
            }
        }
    };

    return (
        <div>
            <h2>Admin Registration</h2>
            <p>Connected MetaMask Address: {account}</p>
            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            /> <br />
            <input
                type="text"
                placeholder="Enter College"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
            /> <br />
            <button onClick={registerAdmin}>Register</button>
            <p>{message}</p>
        </div>
    );
};

export default AdminRegister;