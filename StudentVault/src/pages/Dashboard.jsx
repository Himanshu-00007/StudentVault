import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Students", "Courses", "Attendance"],
          datasets: [
            {
              label: "Total Number",
              data: [students.length, courses.length, attendanceList.length],
              backgroundColor: [
                "rgba(255, 99, 132, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(54, 162, 235, 0.7)",
              ],
              borderRadius: 10,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      });
    }
  }, [students, courses, attendanceList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStudent();
        await getCourses();
        await getAttendanceData();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center fw-bold mb-4">📊 Dashboard Overview</h2>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 fs-5 fw-medium">Loading Data...</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center">
                <div className="card-body">
                  <h5 className="card-title text-secondary">Total Students</h5>
                  <h3 className="text-danger fw-bold">{students.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center">
                <div className="card-body">
                  <h5 className="card-title text-secondary">Total Courses</h5>
                  <h3 className="text-success fw-bold">{courses.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center">
                <div className="card-body">
                  <h5 className="card-title text-secondary">Attendance Records</h5>
                  <h3 className="text-primary fw-bold">{attendanceList.length}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!loading && (
        <div className="container mt-5">
          <h4 className="text-center mb-3">📈 Visual Summary</h4>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <div className="bg-white rounded shadow-sm p-3">
                <canvas ref={chartRef} style={{ maxHeight: "400px" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
