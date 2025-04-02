import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json"; // Adjust the path as needed

const FacultyDashboard = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [departmentCode, setDepartmentCode] = useState("");
    const [subCode, setSubCode] = useState("");
    const [subject, setSubject] = useState("");
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [lectureTime, setLectureTime] = useState("");

    const navigate = useNavigate();

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
                    console.error("Smart contract not deployed on this network.");
                }
            }
        };

        loadBlockchainData();
    }, []);

    const fetchStudents = async () => {
        if (!contract || !departmentCode) {
            alert("Please enter the department.")
        }
        else {
            try {
                const studentList = await contract.methods.getStudentsByDepartment(departmentCode).call();
                const formattedStudents = studentList.map(student => ({
                    // address: student.studentAddress,
                    studentId: student.studentId,
                    name: student.name,
                    department: student.department
                }));
                setStudents(formattedStudents);
                console.log(formattedStudents);

                // Initialize attendance state for each student
                let initialAttendance = {};
                studentList.forEach((student) => {
                    initialAttendance[student.studentId] = "Absent"; // Default to Absent
                });
                setAttendance(initialAttendance);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance({ ...attendance, [studentId]: status });
    };

    const submitAttendance = async () => {
        if (!contract || !subCode || !subject || !lectureTime) {
            alert("Please enter all the details.")
        }
        else {
            try {
                const studentIds = students.map((student) => student.studentId);
                console.log(studentIds);
                const statuses = studentIds.map((id) => attendance[id] === "Present");
                console.log(statuses);

                await contract.methods
                    .markAttendance(subCode, subject, lectureTime, studentIds, statuses)
                    .send({ from: account });

                alert("Attendance marked successfully!");
            } catch (error) {
                console.error("Error marking attendance:", error);
                alert("Student attendance could not be marked. Please check the details and try again.")
            }
        }
    };

    const clearAttendDetails = () => {
        if(window.confirm("Are you sure you want to clear all attendance details?")) {
            setLectureTime("");
            setSubCode("");
            setSubject("");
            setAttendance({});
        }
        else return;
    }

    return (
        <div className="pt-5 pb-5">
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <h1 className="navbar-brand ms-3">Faculty Dashboard</h1>
                </div>
                <a className="nav-link" href="/">
                    <button type="button" id="logoutBtn" className="rounded me-2">Logout</button>
                </a>
            </nav>
            <br /><br/><br/>
            {/* Select Department and Fetch Students */}
            <div className="container d-flex justify-content-center">
                <div className="addForm">
                    <center><h3>Fetch Students</h3></center><br/>
                        <input type="text" className="form-control" placeholder="Enter Department Code" value={departmentCode} onChange={(e) => setDepartmentCode(e.target.value)} required/>
                    <br />
                    <center><button className="submitBtn rounded" onClick={fetchStudents}>Fetch Students</button></center>
                </div>
            </div>

            <br/><br/>

            {/* Mark Attendance */}
            {students.length > 0 && (
                <div className="container d-flex justify-content-center">
                    <div className="addForm">
                        <center><h3>Mark Attendance</h3></center> <br/>

                        <div className="form-row">
                            <div className="form-group col-md-4 col-sm-12">
                                <input type="datetime-local" className="form-control" value={lectureTime} onChange={(e) => setLectureTime(e.target.value)} required/>
                            </div>
                            <div className="form-group col-md-4 col-sm-12">
                                <input type="text" className="form-control" value={subCode} placeholder="Subject Code" onChange={(e) => setSubCode(e.target.value)} required/>
                            </div>
                            <div className="form-group col-md-4 col-sm-12">
                            <input type="text" className="form-control" value={subject} placeholder="Subject Name" onChange={(e) => setSubject(e.target.value)} required/>
                            </div>
                        </div>
                        <br/>
                        
                        <table className="attendTable table-light table-striped border-dark">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.studentId}>
                                        <td>{student.studentId}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <label className="me-2">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.studentId}`}
                                                    value="Present"
                                                    checked={attendance[student.studentId] === "Present"}
                                                    onChange={() => handleAttendanceChange(student.studentId, "Present")}
                                                />
                                                Present
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.studentId}`}
                                                    value="Absent"
                                                    checked={attendance[student.studentId] === "Absent"}
                                                    onChange={() => handleAttendanceChange(student.studentId, "Absent")}
                                                />
                                                Absent
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table><br/>
                        <center>
                            <button className="submitBtn rounded mb-2 me-2" onClick={submitAttendance}>Submit Attendance</button>
                            <button className="clearBtn rounded" onClick={clearAttendDetails}>Clear Details</button>
                        </center>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;