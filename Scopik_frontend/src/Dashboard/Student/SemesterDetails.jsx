import { useEffect, useState } from "react";
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
  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_GETSEM_DETAILS}?department=${department}&university=${university}`
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
  }, [department, id])

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
    return null;
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
  <h2 className="text-xl font-semibold text-blue-700 dark:text-orange-400 mb-4">
    Subjects
  </h2>

  {semester.subjects && semester.subjects.length > 0 ? (
    <div className="grid gap-6 md:grid-cols-2">
      {semester.subjects.map((subject, index) => (
        <div
          key={index}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
        >
          <div className="h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <img
              src={`https://via.placeholder.com/400x200?text=${subject}`}
              alt={subject}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-blue-700 dark:text-orange-400 mb-2">
              {subject}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This course will cover the fundamentals of <b>{subject}</b>. You’ll
              learn concepts, practical applications, and gain knowledge
              necessary for your semester.
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 dark:text-gray-400">No subjects listed.</p>
  )}
</div>
      </div>
    </div>
  );
}
