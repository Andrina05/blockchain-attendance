// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttendanceSystem {
    struct Admin {
        string name;
        string college;
        bool exists;
    }
    
    struct Faculty {
        string name;
        string department;
        bool exists;
    }
    
    struct Student {
        address studentAddress;
        uint studentId;
        string name;
        string department;
        bool exists;
    }
    
    struct Department {
        string name;
        bool exists;
    }

    struct Subject {
        string subCode;
        string subName;
        bool exists;
    }
    
    struct AttendanceRecord {
        string subjectCode;
        string subjectName;
        string lectureTime;
        uint[] studentIds;
        bool[] attendanceStatuses; // Attendance status of each student (true = present, false = absent)
    }

    struct PerStudentAttendance {
        string studentSubjectCode;
        string studentSubjectName;
        string studentLectureTime;
        uint studentId;
        bool studentAttendanceStatus;
    }
    
    mapping(address => Admin) public admins;
    mapping(address => Faculty) public faculties;
    mapping(address => Student) public students;
    mapping(string => Department) public departments;
    mapping(string => mapping(string => Subject)) public subjects;
    mapping(string => address[]) public departmentStudents;
    mapping(string => AttendanceRecord[]) public studentAttendance;
    mapping(string => mapping(address => PerStudentAttendance[])) public perStudentAttendances;

    string[] public departmentKeys;
    address[] public facultyAddresses;
    address[] public studentAddresses;
    
    address public owner;
    
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = Admin("Super Admin", "", true);
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender].exists, "Not an admin");
        _;
    }
    
    function isAdmin(address account) public view returns (bool) {
        return admins[account].exists;
    }
    
    function isFaculty(address account) public view returns (bool) {
        return faculties[account].exists;
    }
    
    function isStudent(address account) public view returns (bool) {
        return students[account].exists;
    }

    function registerAdmin(string memory _name, string memory _college) public {
        require(bytes(admins[msg.sender].name).length == 0, "Admin already registered");
        admins[msg.sender] = Admin(_name, _college, true);
    }

    function addDepartment(string memory deptCode, string memory deptName) public onlyAdmin {
        require(!departments[deptCode].exists, "Department already exists");
        departments[deptCode] = Department(deptName, true);
        departmentKeys.push(deptCode);
    }

    function addSubject(string memory deptCode, string memory subCode, string memory subName) public onlyAdmin {
        require(departments[deptCode].exists, "Department does not exist.");
        require(!subjects[deptCode][subCode].exists, "Subject already added.");
        subjects[deptCode][subCode] = Subject(subCode, subName, true);
    }

    function registerFaculty(address facultyAddress, string memory facultyName, string memory facultyDept) public onlyAdmin {
        require(!faculties[facultyAddress].exists, "Faculty already registered");
        require(departments[facultyDept].exists, "Department does not exist");
        faculties[facultyAddress] = Faculty(facultyName, facultyDept, true);
        facultyAddresses.push(facultyAddress);
    }

    function registerStudent(address studentAddress, uint studentId, string memory studentName, string memory studentDept) public onlyAdmin {
        require(!students[studentAddress].exists, "Student already registered");
        require(departments[studentDept].exists, "Department does not exist");
        students[studentAddress] = Student(studentAddress, studentId, studentName, studentDept, true);
        departmentStudents[studentDept].push(studentAddress);
        studentAddresses.push(studentAddress);
    }

    function getDepartmentCount() public view returns (uint) {
        return departmentKeys.length;
    }

    function getFacultyCount() public view returns (uint) {
        return facultyAddresses.length;
    }

    function getStudentCount() public view returns (uint) {
        return studentAddresses.length;
    }
    
    function getStudentsByDepartment(string memory departmentCode) public view returns (Student[] memory) {
        address[] memory deptStudentAddresses = departmentStudents[departmentCode];
        Student[] memory studentList = new Student[](deptStudentAddresses.length);
        for (uint i = 0; i < deptStudentAddresses.length; i++) {
            studentList[i] = students[deptStudentAddresses[i]];
        }
        return studentList;
    }
    
    function markAttendance(
        string memory deptCode,
        string memory subjectCode, 
        string memory subjectName, 
        string memory lectureTime,
        address[] memory studentAddrs,
        uint[] memory studentIds,
        bool[] memory statuses
    ) public  {
        require(faculties[msg.sender].exists, "Not a faculty member");
        require(studentIds.length == statuses.length, "Mismatched arrays");
        
        // Create a new attendance record
        AttendanceRecord memory newRecord;
        newRecord.subjectCode = subjectCode;
        newRecord.subjectName = subjectName;
        newRecord.lectureTime = lectureTime;
        newRecord.studentIds = studentIds;
        newRecord.attendanceStatuses = statuses;
        studentAttendance[deptCode].push(newRecord);
        
        for (uint i = 0; i < studentIds.length; i++) {
            PerStudentAttendance memory newStudentAttendance;
            newStudentAttendance.studentSubjectCode = newRecord.subjectCode;
            newStudentAttendance.studentSubjectName = newRecord.subjectName;
            newStudentAttendance.studentLectureTime = newRecord.lectureTime;
            newStudentAttendance.studentId = studentIds[i];
            newStudentAttendance.studentAttendanceStatus = statuses[i];
            perStudentAttendances[deptCode][studentAddrs[i]].push(newStudentAttendance);
        }
    }

    function getStudentDetails(address studentAddress) public view returns (uint, string memory, string memory) {
        require(students[studentAddress].exists, "Student not found");
        Student memory student = students[studentAddress];
        return (student.studentId, student.name, student.department);
    }
    
    function getStudentAttendance(address studentAddress, string memory deptCode) public view returns (PerStudentAttendance[] memory) {
        return perStudentAttendances[deptCode][studentAddress];
    }
}