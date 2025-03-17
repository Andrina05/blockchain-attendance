import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import AttendanceSystem from "./build/contracts/AttendanceSystem.json";

const AdminDashboard = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);

    // Form states for adding data
    const [deptCode, setDeptCode] = useState("");
    const [deptName, setDeptName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [subjectName, setSubjectName] = useState("");

    const [facultyAddress, setFacultyAddress] = useState("");
    const [facultyName, setFacultyName] = useState("");
    const [facultyDept, setFacultyDept] = useState("");

    const [studentAddress, setStudentAddress] = useState("");
    const [studentId, setStudentId] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentDept, setStudentDept] = useState("");

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
                    fetchAdminData(instance);
                } else {
                    console.error("Smart contract not deployed on the network.");
                }
            }
        };
        loadBlockchainData();
    }, []);

    const fetchAdminData = async (contract) => {
        if (!contract) return;

        try {
            // Fetch departments
            const deptCount = await contract.methods.getDepartmentCount().call();
            let deptList = [];
            for (let i = 0; i < deptCount; i++) {
                let deptCode = await contract.methods.departmentKeys(i).call();
                let deptData = await contract.methods.departments(deptCode).call();
                deptList.push({
                    code: deptCode,
                    name: deptData.name
                });
            }
            setDepartments(deptList);

            // Fetch faculties
            const facultyCount = await contract.methods.getFacultyCount().call();
            let facultyList = [];
            for (let i = 0; i < facultyCount; i++) {
                let facultyAddr = await contract.methods.facultyAddresses(i).call();
                let facultyData = await contract.methods.faculties(facultyAddr).call();
                facultyList.push({
                    address: facultyAddr,
                    name: facultyData.name,
                    department: facultyData.department
                });
            }
            setFaculties(facultyList);

            // Fetch students
            const studentCount = await contract.methods.getStudentCount().call();
            let studentList = [];
            for (let i = 0; i < studentCount; i++) {
                let studentAddr = await contract.methods.studentAddresses(i).call();
                let studentData = await contract.methods.students(studentAddr).call();
                studentList.push({
                    address: studentAddr,
                    studentId: studentData.studentId,
                    name: studentData.name,
                    department: studentData.department
                });
            }
            setStudents(studentList);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const addDepartment = async () => {
        if (!contract || !deptCode || !deptName) return;

        try {
            await contract.methods.addDepartment(deptCode, deptName).send({ from: account });
            alert("Department added successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding department:", error);
        }
    };

    const addSubject = async () => {
        if (!contract || !deptCode || !subjectCode || !subjectName) return;

        try {
            await contract.methods.addSubject(deptCode, subjectCode, subjectName).send({ from: account });
            alert("Subject added successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    const addFaculty = async () => {
        if (!contract || !facultyAddress || !facultyName || !facultyDept) return;

        try {
            await contract.methods.registerFaculty(facultyAddress, facultyName, facultyDept).send({ from: account });
            alert("Faculty registered successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding faculty:", error);
        }
    };

    const addStudent = async () => {
        if (!contract || !studentAddress || !studentId || !studentName || !studentDept) return;

        try {
            await contract.methods.registerStudent(studentAddress, studentId, studentName, studentDept).send({ from: account });
            alert("Student registered successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Connected MetaMask Address: {account}</p>

            {/* Add Department Section */}
            <div>
                <h3>Add Department</h3>
                <input
                    type="text"
                    placeholder="Department Code"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Department Name"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                />
                <button onClick={addDepartment}>Add Department</button>
            </div>

            {/* Add Subject Section */}
            <div>
                <h3>Add Subject</h3>
                <input
                    type="text"
                    placeholder="Department Code"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Subject Code"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                />
                <button onClick={addSubject}>Add Subject</button>
            </div>

            {/* Register Faculty Section */}
            <div>
                <h3>Register Faculty</h3>
                <input
                    type="text"
                    placeholder="Faculty Address"
                    value={facultyAddress}
                    onChange={(e) => setFacultyAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Faculty Name"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Department Code"
                    value={facultyDept}
                    onChange={(e) => setFacultyDept(e.target.value)}
                />
                <button onClick={addFaculty}>Register Faculty</button>
            </div>

            {/* Register Student Section */}
            <div>
                <h3>Register Student</h3>
                <input
                    type="text"
                    placeholder="Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Department Code"
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                />
                <button onClick={addStudent}>Register Student</button>
            </div>

            {/* Display Departments */}
            <h3>Departments</h3>
            <ul>{departments.map((dept, index) => <li key={index}>{dept.name} ({dept.code})</li>)}</ul>

            {/* Display Faculties */}
            <h3>Faculties</h3>
            <ul>{faculties.map((faculty, index) => <li key={index}>{faculty.name} - {faculty.department}</li>)}</ul>

            {/* Display Students */}
            <h3>Students</h3>
            <ul>{students.map((student, index) => <li key={index}>{student.name} - {student.studentId}</li>)}</ul>

            <button onClick={() => navigate("/")}>Logout</button>
        </div>
    );
};
export default AdminDashboard;