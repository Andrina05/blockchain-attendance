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
            if(!name || !college) {
                alert("Please fill out all the details.");
            }
            else {
                try {
                    await contract.methods.registerAdmin(name, college).send({ from: account });
                    setMessage("Admin registered successfully!");
                    navigate("/login");
                } catch (error) {
                    setMessage("Registration failed. Please try again.");
                }
            }
        }
    };

    const clearDetails = () => {
        setName("");
        setCollege("");
    }

    return (
        <div className="pt-5 pb-5"> 
            <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
                <h1 className="navbar-brand ms-3">Admin Registration</h1>
            </nav>
            <div id="adminDiv" className="mt-5 container d-flex flex-column justify-content-lg-start">
                <center><h2 className="text-3xl font-bold mb-6">Please fill the following details:</h2></center> <br/>
                <label for="adminName">Enter your name:</label>
                <input
                    type="text"
                    name="adminName"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                /> <br/><br/>
                <label for="adminCollege">Enter your college:</label>
                <input
                    type="text"
                    name="adminCollege"
                    placeholder="College name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                /> <br/><br/>
                <center>
                    <button class="submitBtn rounded m-1" onClick={registerAdmin}>Register</button>
                    <button class="clearBtn rounded" onClick={clearDetails}>Clear</button>
                </center>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default AdminRegister;