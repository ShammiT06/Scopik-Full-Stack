
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SemesterDetail() {
  const { id } = useParams();
  const [semester, setSemester] = useState(null);
  const [department, setDepartment] = useState("");
  const [university,setUniversity]=useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("userEmail");

  // Fetch the student's department
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STUDENT_PROGRESS}?email=${userEmail}`
        );
        setUniversity(res.data.student.university)
        setDepartment(res.data.student.department);
      } catch (err) {
        setError("Failed to fetch department.");
        console.error(err);
      }
    };

    if (userEmail) {
      fetchDepartment();
    } else {
      setError("User email not found.");
    }
  }, [userEmail]);

  // Fetch semester details after department is available
  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await axios.get(
          `https://lmsdemo.thirdvizion.com/api/getsyllabus/?department=${department}&university=${university}`
        );

        const matchedSemester = res.data.find(
          (s) => s.id.toString() === id.toString()
        );

        if (matchedSemester) {
          setSemester(matchedSemester);
        } else {
          setError("Semester not found.");
        }
      } catch (err) {
        setError("Failed to fetch semester details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (department) {
      fetchSemester();
    }
  }, [department, id]);

  // Render states
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Loading semester details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!semester) {
    return null; // Shouldn't happen, handled by error state
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 px-4 py-10 text-black dark:text-white">
      <div className="max-w-3xl mt-20 mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-orange-500 mb-4">
          Semester {semester.sem} Details
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Department: <strong>{semester.department}</strong> | Start Date:{" "}
          <strong>{semester.start_date}</strong>
        </p>

        {semester.description && (
          <p className="text-lg leading-7 text-gray-800 dark:text-gray-300 whitespace-pre-line mb-4">
            {semester.description}
          </p>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 dark:text-orange-400 mb-2">
            Subjects
          </h2>
          {semester.subjects && semester.subjects.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {semester.subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No subjects listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
