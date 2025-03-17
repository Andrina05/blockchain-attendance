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

  // Initial function to fetch students
  const fetchStudents = async () => {
    if (!contract || !departmentCode) return;

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
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const submitAttendance = async () => {
    if (!contract || !subCode || !subject || !lectureTime) return;

    try {
      const studentIds = students.map((student) => student.studentId);
      console.log(studentIds);
      const statuses = studentIds.map((id) => attendance[id] === "Present");
      console.log(statuses);

      // subjectCode, subjectName, lectureTime, studentIds, statuses
      await contract.methods
        .markAttendance(subCode, subject, lectureTime, studentIds, statuses)
        .send({ from: account });

      alert("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Student attendance could not be marked. Please check the details and try again.")
    }
  };

  return (
    <div>
      <h2>Faculty Dashboard</h2>
      <p>Connected MetaMask Address: {account}</p>

      {/* Select Department and Fetch Students */}
      <div>
        <h3>Fetch Students</h3>
        <input
          type="text"
          placeholder="Enter Department Code"
          value={departmentCode}
          onChange={(e) => setDepartmentCode(e.target.value)}
        />
        <button onClick={fetchStudents}>Fetch Students</button>
      </div>

      {/* Mark Attendance */}
      {students.length > 0 && (
        <div>
          <h3>Mark Attendance</h3>
          <input
            type="datetime-local"
            value={lectureTime}
            onChange={(e) => setLectureTime(e.target.value)}
          />

          <input
            type="text"
            value={subCode}
            placeholder="Subject Code"
            onChange={(e) => setSubCode(e.target.value)}
          />

          <input
            type="text"
            value={subject}
            placeholder="Subject Name"
            onChange={(e) => setSubject(e.target.value)}
          />
          <table border="1">
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
                    <label>
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
          </table>
          <button onClick={submitAttendance}>Submit Attendance</button>
        </div>
      )}

      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

export default FacultyDashboard;