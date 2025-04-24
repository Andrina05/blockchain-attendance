const contractABI =
    [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "admins",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "college",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "departmentKeys",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "departmentStudents",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "departments",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "faculties",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "department",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "facultyAddresses",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "perStudentAttendances",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "studentSubjectCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "studentSubjectName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "studentLectureTime",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "studentId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "studentAttendanceStatus",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "studentAddresses",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "studentAttendance",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "subjectCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "subjectName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "lectureTime",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "students",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "studentId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "department",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "subjects",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "subCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "subName",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "isAdmin",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "isFaculty",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "isStudent",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_college",
                    "type": "string"
                }
            ],
            "name": "registerAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "deptCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "deptName",
                    "type": "string"
                }
            ],
            "name": "addDepartment",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "deptCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "subCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "subName",
                    "type": "string"
                }
            ],
            "name": "addSubject",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "facultyAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "facultyName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "facultyDept",
                    "type": "string"
                }
            ],
            "name": "registerFaculty",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "studentId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "studentDept",
                    "type": "string"
                }
            ],
            "name": "registerStudent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getDepartmentCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "getFacultyCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "getStudentCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "departmentCode",
                    "type": "string"
                }
            ],
            "name": "getStudentsByDepartment",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "studentAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "studentId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "department",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "exists",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct AttendanceSystem.Student[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "deptCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "subjectCode",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "subjectName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "lectureTime",
                    "type": "string"
                },
                {
                    "internalType": "address[]",
                    "name": "studentAddrs",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "studentIds",
                    "type": "uint256[]"
                },
                {
                    "internalType": "bool[]",
                    "name": "statuses",
                    "type": "bool[]"
                }
            ],
            "name": "markAttendance",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                }
            ],
            "name": "getStudentDetails",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "deptCode",
                    "type": "string"
                }
            ],
            "name": "getStudentAttendance",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "studentSubjectCode",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "studentSubjectName",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "studentLectureTime",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "studentId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "studentAttendanceStatus",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct AttendanceSystem.PerStudentAttendance[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        }
    ];
export default contractABI;
