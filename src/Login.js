import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";

const Login = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
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
                navigate("/admin-dashboard");
                return;
            }
    
            // Check if the user is a faculty member
            const isFaculty = await contract.methods.isFaculty(account).call();
            if (isFaculty) {
                navigate("/faculty-dashboard");
                return;
            }
    
            // Check if the user is a student
            const isStudent = await contract.methods.isStudent(account).call();
            if (isStudent) {
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
        <div className="pt-5 pb-5"> 
            <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
                <h1 className="navbar-brand ms-3">Login</h1>
            </nav>
            <div id="loginDiv" className="mt-5 container d-flex flex-column justify-content-lg-start">
                <center><h2 className="text-3xl font-bold mb-6">Login</h2></center> <br/>
                <h4>Connected MetaMask Address:</h4>
                <p className="text-truncate">{account || "Not connected"}</p> <br/>
                <center>
                    <button className="submitBtn rounded" onClick={loginUser}>Login</button>
                </center>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
        </div>
    );
};
export default Login;