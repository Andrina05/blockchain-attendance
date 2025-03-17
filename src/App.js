import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Web3 from "web3";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";
import Welcome from "./Welcome.js";
import Login from "./Login.js";
import AdminDashboard from "./AdminDashboard.js";
import FacultyDashboard from "./FacultyDashboard.js";
import StudentDashboard from "./StudentDashboard.js";
import AdminRegister from "./AdminRegister.js";

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
                        checkUserRole(instance, accounts[0]);
                    } else {
                        console.error("Smart contract not deployed on this network.");
                    }
                } catch (error) {
                    console.error("Error connecting to MetaMask:", error);
                }
            } else {
                console.error("MetaMask not detected!");
            }
        };
        loadBlockchainData();
    }, []);

    const checkUserRole = async (contractInstance, userAddress) => {
        try {
            const isAdmin = await contractInstance.methods.isAdmin(userAddress).call();
            if (isAdmin) {
                setUserRole("admin");
                setLoading(false);
                return;
            }

            const isFaculty = await contractInstance.methods.isFaculty(userAddress).call();
            if (isFaculty) {
                setUserRole("faculty");
                setLoading(false);
                return;
            }

            const isStudent = await contractInstance.methods.isStudent(userAddress).call();
            if (isStudent) {
                setUserRole("student");
                setLoading(false);
                return;
            }

            setUserRole(null);
            setLoading(false);
        } catch (error) {
            console.error("Error checking user role:", error);
            setLoading(false);
        }
    };

  const logout = () => {
    setAccount(null);
    setUserRole(null);
    window.location.href = "/"; // Redirect to Welcome page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-admin" element={<AdminRegister />} />

        {userRole === "admin" && (
          <Route path="/admin-dashboard" element={<AdminDashboard logout={logout} />} />
        )}
        {userRole === "faculty" && (
          <Route path="/faculty-dashboard" element={<FacultyDashboard logout={logout} />} />
        )}
        {userRole === "student" && (
          <Route path="/student-dashboard" element={<StudentDashboard logout={logout} />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
export default App;