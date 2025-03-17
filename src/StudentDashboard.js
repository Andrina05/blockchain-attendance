import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";

const StudentDashboard = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);

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
          fetchStudentData(instance, accounts[0]);
          fetchStudentAttendance(instance, accounts[0]);
        } else {
          console.error("Smart contract not deployed on this network.");
        }
      }
    };

    loadBlockchainData();
  }, []);

  const fetchStudentData = async (contractInstance, studentAddress) => {
    try {
      const [studentId, studentName, studentDept] = await contractInstance.methods.getStudentDetails(studentAddress).call();
      setStudentData({ studentId, studentName, studentDept });
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchStudentAttendance = async (contractInstance, studentAddress) => {
    try {
      const attendance = await contractInstance.methods.getStudentAttendance(studentAddress).call();
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
    <div>
      {studentData && (
        <div>
          <p>ID: {studentData.studentId}</p>
          <p>Department: {studentData.studentDept}</p>
        </div>
      )}

      <h3>Your Attendance Records:</h3>
      {attendanceRecords && Object.keys(attendanceRecords).length > 0 ? (
        <div>
            <table border="1">
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
            <h3>Overall Attendance: {overallAttendance.toFixed(2)}%</h3>
        </div>
      ) : (
        <p>No attendance records available.</p>
      )}
      
      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

export default StudentDashboard;
