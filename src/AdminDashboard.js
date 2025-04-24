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

    const [subDept, setSubDept] = useState("");
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

    const addDepartment = async (event) => {
        event.preventDefault();
        if (!contract || !deptCode || !deptName) {
            alert("Please fill all the details.");
            return;
        }
        try {
            await contract.methods.addDepartment(deptCode, deptName).send({ from: account });
            alert("Department added successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding department:", error);
            alert("Failed to add department. Please check the details and try again.");
        }
    };
    const clearDepartmentDetails = () => {
        setDeptCode("");
        setDeptName("");
    }

    const addSubject = async (event) => {
        event.preventDefault();
        if (!contract || !subDept || !subjectCode || !subjectName) {
            alert("Please fill all the details.");
            return;
        }

        try {
            await contract.methods.addSubject(subDept, subjectCode, subjectName).send({ from: account });
            alert("Subject added successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding subject:", error);
            alert("Failed to add subject. Please check the details and try again.");
        } 
    };
    const clearSubjecttDetails = () => {
        setSubDept("");
        setSubjectCode("");
        setSubjectName("");
    }

    const addFaculty = async (event) => {
        event.preventDefault();
        if (!contract || !facultyAddress || !facultyName || !facultyDept) {
            alert("Please fill all the details.");
            return;
        }
        try {
            await contract.methods.registerFaculty(facultyAddress, facultyName, facultyDept).send({ from: account });
            alert("Faculty registered successfully!");
            fetchAdminData(contract);
        } catch (error) {
            console.error("Error adding faculty:", error);
            alert("Failed to register faculty. Please check the details and try again.");
        }
    };
    const clearFacultyDetails = () => {
        setFacultyAddress("");
        setFacultyName("");
        setFacultyDept("");
    }

    const addStudent = async (event) => {
        event.preventDefault();
        if (!contract || !studentAddress || !studentId || !studentName || !studentDept) {
            alert("Please fill all the details.");
            return;
        }
        try {
            await contract.methods.registerStudent(studentAddress, studentId, studentName, studentDept).send({ from: account });
            alert("Student registered successfully!");
            fetchAdminData(contract);

        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to register student. Please check the details and try again.")
        }
    };
    const clearStudentDetails = () => {
        setStudentAddress("");
        setStudentId("");
        setStudentName("");
        setStudentDept("");
    }

    return (
        <div className="ps-3 pe-3">
            <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <h1 className="navbar-brand ms-3">Admin Dashboard</h1>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#AddDept">Add Department</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#AddSubject">Add Subject</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#AddFaculty">Add Faculty</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#AddStudent">Add Student</a>
                        </li>
                    </ul>
                </div>
                <a className="nav-link" href="/">
                    <button type="button" id="logoutBtn" className="rounded me-2">Logout</button>
                </a>
            </nav>
            <br /><br /><br />
            <center><h2>Admin Dashboard</h2></center> <br />

            {/* Add Department Section */}
            <div className="container d-flex justify-content-center">
                <form id="AddDept" className="addForm">
                    <center><h3>Add Department</h3></center><br />
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="DeptCode">Enter Department Code:</label>
                            <input type="text" className="form-control" name="DeptCode" placeholder="Department Code"
                                value={deptCode} onChange={(e) => setDeptCode(e.target.value)} required />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="DeptName">Enter Department Name:</label>
                            <input type="text" className="form-control" name="DeptName" placeholder="Department Name"
                                value={deptName} onChange={(e) => setDeptName(e.target.value)} required />
                        </div>
                    </div>
                    <br />
                    <center>
                        <button className="submitBtn rounded mb-2 me-2" onClick={addDepartment}>Add Department</button>
                        <button className="clearBtn rounded" onClick={clearDepartmentDetails}>Clear</button>
                    </center>
                </form>
            </div>


            {/* Add Subject Section */}
            <br /><br />
            <div className="container d-flex justify-content-center">
                <form id="AddSubject" className="addForm">
                    <center><h3>Add Subject</h3></center><br />
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="SubDeptCode">Enter Department Code:</label>
                            <input type="text" className="form-control" name="SubDeptCode" placeholder="Department Code"
                                value={subDept} onChange={(e) => setSubDept(e.target.value)} required />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="SubCode">Enter Subject Code:</label>
                            <input type="text" className="form-control" name="SubCode" placeholder="Subject Code"
                                value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="SubName">Enter Subject Name:</label>
                            <input type="text" className="form-control" name="SubName" placeholder="Subject Name"
                                value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required />
                        </div>
                    </div>
                    <br />
                    <center>
                        <button className="submitBtn rounded mb-2 me-2" onClick={addSubject}>Add Subject</button>
                        <button className="clearBtn rounded" onClick={clearSubjecttDetails}>Clear</button>
                    </center>
                </form>
            </div>

            {/* Register Faculty Section */}
            <br /><br />
            <div className="container d-flex justify-content-center">
                <form id="AddFaculty" className="addForm">
                    <center><h3>Register Faculty</h3></center><br />
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="FacultyAddr">Enter Faculty Address:</label>
                            <input type="text" className="form-control" name="FacultyAddr" placeholder="Metamask Address (0x...)"
                                value={facultyAddress} onChange={(e) => setFacultyAddress(e.target.value)} required />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="FacultyName">Enter Faculty Name:</label>
                            <input type="text" className="form-control" name="FacultyName" placeholder="FirstName LastName"
                                value={facultyName} onChange={(e) => setFacultyName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="FacultyDeptCode">Enter Faculty's Department Code:</label>
                            <input type="text" className="form-control" name="FacultyDeptCode" placeholder="Department Code"
                                value={facultyDept} onChange={(e) => setFacultyDept(e.target.value)} required />
                        </div>
                    </div>
                    <br />
                    <center>
                        <button className="submitBtn rounded mb-2 me-2" onClick={addFaculty}>Register Faculty</button>
                        <button className="clearBtn rounded" onClick={clearFacultyDetails}>Clear</button>
                    </center>
                </form>
            </div>

            <br /><br />
            <div className="container d-flex justify-content-center">
                <form id="AddStudent" className="addForm">
                    <center><h3>Register Student</h3></center><br />
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="StudentAddr">Enter Student Address:</label>
                            <input type="text" className="form-control" name="StudentAddr" placeholder="Metamask Address (0x...)"
                                value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} required />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="StudentID">Enter Student Roll No.:</label>
                            <input type="text" className="form-control" name="StudentID" placeholder="Roll no."
                                value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="StudentName">Enter Student Name:</label>
                            <input type="text" className="form-control" name="StudentName" placeholder="FirstName LastName"
                                value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label htmlFor="StudentDeptCode">Enter Student's Department Code:</label>
                            <input type="text" className="form-control" name="StudentDeptCode" placeholder="Department Code"
                                value={studentDept} onChange={(e) => setStudentDept(e.target.value)} required />
                        </div>
                    </div>
                    <br />
                    <center>
                        <button className="submitBtn rounded mb-2 me-2" onClick={addStudent}>Register Student</button>
                        <button className="clearBtn rounded" onClick={clearStudentDetails}>Clear</button>
                    </center>
                </form>
            </div>
            <br /><br />

            <div className="row">
                {/* Display Departments */}
                <div className="card col-lg-4 col-sm-12">
                    <h3>Departments</h3>
                    <ul>{departments.map((dept, index) => <li key={index}>{dept.name} ({dept.code})</li>)}</ul>
                </div>

                {/* Display Faculties */}
                <div className="card col-lg-4 col-sm-12">
                    <h3>Faculties</h3>
                    <ul>{faculties.map((faculty, index) => <li key={index}>{faculty.name} - {faculty.department}</li>)}</ul>
                </div>

                {/* Display Students */}
                <div className="card col-lg-4 col-sm-12">
                    <h3>Students</h3>
                    <ul>{students.map((student, index) => <li key={index}>{student.name} - {student.studentId}</li>)}</ul>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;