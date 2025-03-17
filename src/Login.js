import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";

const Login = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                try {
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
                } catch (error) {
                    console.error("Error connecting to blockchain: ", error);
                }
            } else {
                setErrorMessage("MetaMask is not installed. Please install it.");
            }
        };

        loadBlockchainData();
    }, []);

    const loginUser = async () => {
        if (!contract || !account) {
            setErrorMessage("Please connect to MetaMask.");
            return;
        }
    
        try {
            // Check if the user is an admin
            const isAdmin = await contract.methods.isAdmin(account).call();
            if (isAdmin) {
                // setRole("admin");
                navigate("/admin-dashboard");
                return;
            }
    
            // Check if the user is a faculty member
            const isFaculty = await contract.methods.isFaculty(account).call();
            if (isFaculty) {
                // setRole("faculty");
                navigate("/faculty-dashboard");
                return;
            }
    
            // Check if the user is a student
            const isStudent = await contract.methods.isStudent(account).call();
            if (isStudent) {
                // setRole("student");
                navigate("/student-dashboard");
                return;
            }
    
            setErrorMessage("User not registered. Please contact the admin.");
        } catch (error) {
            console.error("Login failed: ", error);
            setErrorMessage("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <p>Connected MetaMask Address: {account || "Not connected"}</p>
            <button onClick={loginUser}>Login</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
};

export default Login;