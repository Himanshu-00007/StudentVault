import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../config/firebase";
import { FaCalendarAlt, FaUserGraduate, FaBookOpen } from "react-icons/fa";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const collectionStudents = collection(db, "students");
  const collectionCourses = collection(db, "courses");
  const collectionAttendance = collection(db, "attendance");

  const getStudent = async () => {
    try {
      const data = await getDocs(collectionStudents);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudents(filteredData);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const getCourses = async () => {
    try {
      const data = await getDocs(collectionCourses);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCourses(filteredData);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const getAttendanceData = async () => {
    try {
      const data = await getDocs(collectionAttendance);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAttendanceList(filteredData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStudent();
        await getCourses();
        await getAttendanceData();
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConfirmAttendance = async () => {
    // Validate that all required fields are selected
    if (
      !selectedStudent ||
      !selectedCourse ||
      !attendanceDate ||
      !attendanceStatus
    ) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Find the selected student and course
      const selectedStudentObj = students.find(
        (student) => student.id === selectedStudent
      );
      const selectedCourseObj = courses.find(
        (course) => course.id === selectedCourse
      );

      // Add a new document to the "attendance" collection
      await addDoc(collectionAttendance, {
        stname: selectedStudentObj.name,
        crname: selectedCourseObj.title,
        date: attendanceDate,
        attendance: attendanceStatus,
      });

      // Reset the state after confirming attendance
      setSelectedStudent("");
      setSelectedCourse("");
      setAttendanceDate("");
      setAttendanceStatus("");

      // Refresh attendance data
      await getAttendanceData();
      toast.success("Attendance recorded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding attendance data:", error);
      toast.error("Failed to record attendance", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filter attendance by date
  const filteredAttendance = filterDate 
    ? attendanceList.filter(item => item.date === filterDate)
    : attendanceList;

  return (
    <>
      <div className="container-fluid mt-3">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center mb-0">
                  <FaCalendarAlt className="me-2" />
                  Attendance Management
                </h2>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <h5 className="mb-0 me-3">Filter by Date:</h5>
                      <input
                        type="date"
                        className="form-control w-50"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                      {filterDate && (
                        <button 
                          className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => setFilterDate("")}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <button
                      type="button"
                      className="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#attendanceModal"
                    >
                      <i className="fas fa-plus-circle me-2"></i>
                      Record New Attendance
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Student Name</th>
                        <th scope="col">Course Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((attendance, index) => (
                        <tr key={attendance.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaUserGraduate className="me-2 text-primary" />
                              {attendance.stname}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaBookOpen className="me-2 text-info" />
                              {attendance.crname}
                            </div>
                          </td>
                          <td>{attendance.date}</td>
                          <td>
                            <span
                              className={`badge ${
                                attendance.attendance === "Present"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {attendance.attendance}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredAttendance.length === 0 && !loading && (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <div className="alert alert-info mb-0">
                              No attendance records found
                              {filterDate ? ` for date ${filterDate}` : ""}
                            </div>
                          </td>
                        </tr>
                      )}
                      {loading && (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="spinner-border text-primary me-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              <span style={{ fontSize: "1.2rem" }}>Loading attendance data...</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer text-muted">
                <div className="d-flex justify-content-between">
                  <span>Total Records: {filteredAttendance.length}</span>
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Attendance Modal */}
      <div
        className="modal fade"
        id="attendanceModal"
        tabIndex="-1"
        aria-labelledby="attendanceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="attendanceModalLabel">
                <FaCalendarAlt className="me-2" />
                Record New Attendance
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label" htmlFor="studentSelect">
                    <FaUserGraduate className="me-2" />
                    Select Student
                  </label>
                  <select
                    id="studentSelect"
                    className="form-select form-select-lg mb-3"
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    value={selectedStudent}
                  >
                    <option value="" disabled>
                      Choose a student
                    </option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label" htmlFor="courseSelect">
                    <FaBookOpen className="me-2" />
                    Select Course
                  </label>
                  <select
                    id="courseSelect"
                    className="form-select form-select-lg mb-3"
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    value={selectedCourse}
                  >
                    <option value="" disabled>
                      Choose a course
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label" htmlFor="attendanceDate">
                    <FaCalendarAlt className="me-2" />
                    Attendance Date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    id="attendanceDate"
                    name="attendanceDate"
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    value={attendanceDate}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label d-block">
                    <i className="fas fa-check-circle me-2"></i>
                    Attendance Status
                  </label>
                  <div className="d-flex justify-content-around p-3 border rounded">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="attendance"
                        id="present"
                        onChange={() => setAttendanceStatus("Present")}
                        checked={attendanceStatus === "Present"}
                        style={{ transform: "scale(1.5)" }}
                      />
                      <label
                        className="form-check-label ms-2 fs-5"
                        htmlFor="present"
                      >
                        Present
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="attendance"
                        id="absent"
                        onChange={() => setAttendanceStatus("Absent")}
                        checked={attendanceStatus === "Absent"}
                        style={{ transform: "scale(1.5)" }}
                      />
                      <label
                        className="form-check-label ms-2 fs-5"
                        htmlFor="absent"
                      >
                        Absent
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmAttendance}
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Attendance;