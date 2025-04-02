import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-5 pb-5">
            <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
                <h1 className="navbar-brand ms-3">Welcome</h1>
            </nav>

            <center>
                <div id="welcomeBox" className="mt-5 container rounded ">
                    <h1 className="text-3xl font-bold mb-6">Blockchain-based Attendance System</h1> <br />
                    <div>
                        <button
                            onClick={() => navigate("/register-admin")}
                            className="welcomeBtn rounded"
                        >
                            Register as Admin
                        </button>
                        <br /><br />
                        <a href="/login">
                            <button
                                onClick={() => navigate("/login")}
                                className="welcomeBtn rounded"
                            >
                                Login
                            </button>
                        </a>
                    </div>
                </div>
            </center>
        </div>
    );
};

export default Welcome;