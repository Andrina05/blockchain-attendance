import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";

const StudentDashboard = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [overallAttendance, setOverallAttendance] = useState(0);

    let studDept = "";

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
                    fetchStudentData(instance, accounts[0]);
                } else {
                    console.error("Smart contract not deployed on this network.");
                }
            }
        };

        loadBlockchainData();
    }, []);

    const fetchStudentData = async (contractInstance, studentAddress) => {
        try {
            const fetchedDetails = await contractInstance.methods.getStudentDetails(studentAddress).call();
            console.log("Fetched Details:", fetchedDetails[0], fetchedDetails[1], fetchedDetails[2])
            const studentId = fetchedDetails[0];
            const studentName = fetchedDetails[1];
            studDept = fetchedDetails[2];

            setStudentData({ studentId, studentName, studDept });
            fetchStudentAttendance(contractInstance, studentAddress, studDept);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const fetchStudentAttendance = async (contractInstance, studentAddress, studentDepartment) => {
        try {
            const attendance = await contractInstance.methods.getStudentAttendance(studentAddress, studentDepartment).call();
            processAttendanceData(attendance);
        } catch (error) {
            console.error("Error fetching student attendance:", error);
        }
    };

    const processAttendanceData = (attendance) => {
        let totalLectures = 0;
        let totalAttended = 0;
        let subjectRecords = {};

        attendance.forEach((record) => {
            const { studentSubjectCode, studentAttendanceStatus } = record;

            // Initialize subject record if not already present
            if (!subjectRecords[studentSubjectCode]) {
                subjectRecords[studentSubjectCode] = { totalLectures: 0, totalAttended: 0 };
            }

            // Increment total lectures for the subject
            subjectRecords[studentSubjectCode].totalLectures += 1;

            // If the student was present, increment total attended
            if (studentAttendanceStatus) {
                subjectRecords[studentSubjectCode].totalAttended += 1;
            }

            // Also keep track of the overall attendance
            totalLectures += 1;
            if (studentAttendanceStatus) totalAttended += 1;
        });

        setAttendanceRecords(subjectRecords);
        setOverallAttendance((totalAttended / totalLectures) * 100);
    };

    const renderAttendanceTable = () => {
        return Object.keys(attendanceRecords).map((subjectCode) => {
            const { totalLectures, totalAttended } = attendanceRecords[subjectCode];
            const attendancePercentage = ((totalAttended / totalLectures) * 100).toFixed(2);

            return (
                <tr key={subjectCode}>
                    <td>{subjectCode}</td>
                    <td>{totalLectures}</td>
                    <td>{totalAttended}</td>
                    <td>{attendancePercentage}%</td>
                </tr>
            );
        });
    };

    return (
        <div className="pt-5 pb-5">
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavbar">
                <h1 className="navbar-brand ms-3">Student Dashboard</h1>
            </div>
            <a className="nav-link" href="/">
                <button type="button" id="logoutBtn" className="rounded me-2">Logout</button>
            </a>
        </nav>
        <br /><br/>
            <div className="ms-3 me-3">
                {studentData && (
                    <div className="bg-light col-sm-12 col-md-10 col-lg-7 pt-1 pb-1">
                        <p>ID: {studentData.studentId}</p>
                        <p>Department: {studentData.studDept}</p>
                    </div>
                )}
                <br/>
                <h3>Your Attendance Records:</h3><br/>
                {attendanceRecords && Object.keys(attendanceRecords).length > 0 ? (
                    <div className="tableSpace col-sm-12 col-md-10 col-lg-7">
                        <table className="attendTable table-light table-striped">
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Total Lectures</th>
                                    <th>Total Attended</th>
                                    <th>Attendance Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderAttendanceTable()}
                            </tbody>
                        </table>
                        <br/>
                        <h3>Overall Attendance: {overallAttendance.toFixed(2)}%</h3>
                    </div>
                ) : (
                    <p>No attendance records available.</p>
                )}
            </div>
        </div>
    );
};
export default StudentDashboard;