// import axios from "axios";
// import { useEffect, useState } from "react";

// function SemesterList() {
//   const [courses, setCourses] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [campus, setCampus] = useState([]); // universities list
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [semesterNumber, setSemesterNumber] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [department, setDepartment] = useState("");
//   const [university, setUniversity] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [showFullContent, setShowFullContent] = useState(false);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState("info"); 

//   const [courseToggle, setCourseToggle] = useState({}); // track "read more" per semester

//   const username = import.meta.env.VITE_USER_NAME;
//   const password = import.meta.env.VITE_USER_PASS;

//   const token = btoa(`${username}:${password}`);

//   useEffect(() => {
//     fetchCourses();
//     fetchSemesters();
//     fetchUniversities();
//   }, []);

//   // ✅ FIXED: delete with required params
//   const handleDelete = (uniName, dept, semNumber) => {
//     axios
//       .delete(`${import.meta.env.VITE_SEM_DELETE}/${uniName}/${dept}/${semNumber}/`, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then(() => {
//         showModal("Semester deleted successfully.", "success");
//         fetchSemesters()
//       })
//       .catch((err) => {
//         console.error("Failed to delete semester:", err);
//         showModal("Failed to delete semester. Check console for details.", "error");
//       });
//   };

//   const fetchCourses = () => {
//     axios
//       .get(import.meta.env.VITE_Course_name, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => setCourses(res.data))
//       .catch((err) => {
//         console.error("Failed to fetch courses", err);
//         showModal("Failed to fetch courses. Check console.", "error");
//       });
//   };

//   const fetchSemesters = () => {
//     axios
//       .get(import.meta.env.VITE_View_Semester, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => setSemesters(res.data))
//       .catch((err) => {
//         console.error("Failed to fetch semesters", err);
//         showModal("Failed to fetch semesters. Check console.", "error");
//       });
//   };

//   const fetchUniversities = () => {
//     axios
//       .get(import.meta.env.VITE_VIEW_UNIVERSITY, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => setCampus(res.data))
//       .catch((err) => {
//         console.error("Failed to fetch universities", err);
//         showModal("Failed to fetch universities. Check console.", "error");
//       });
//   };

//   const handleCourseSelection = (courseId) => {
//     if (selectedCourses.includes(courseId)) {
//       setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
//     } else {
//       setSelectedCourses([...selectedCourses, courseId]);
//     }
//   };

//   const resetForm = () => {
//     setSemesterNumber("");
//     setStartDate("");
//     setDepartment("");
//     setSelectedCourses([]);
//     setUniversity("");
//   };

//   const showModal = (message, type = "info") => {
//     setModalMessage(message);
//     setModalType(type);
//     setModalOpen(true);
//   };

//   const handleSubmit = () => {
//     if (!semesterNumber || !startDate || !department || !university) {
//       showModal("Please fill all required fields.", "error");
//       return;
//     }

//     const payload = {
//       course_ids: selectedCourses,
//       sem: semesterNumber,
//       start_date: startDate,
//       department: department,
//       university: university,
//     };

//     axios
//       .post(import.meta.env.VITE_Create_Semester, payload, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then(() => {
//         showModal("Semester created successfully.", "success");
//         resetForm();
//         setShowForm(false);
//         fetchSemesters();
//       })
//       .catch((err) => {
//         console.error("Semester creation failed:", err);
//         showModal("Semester creation failed. Check console for details.", "error");
//       });
//   };

//   const toggleContent = () => setShowFullContent((prev) => !prev);

//   const toggleCourseList = (semesterId) => {
//     setCourseToggle((prev) => ({
//       ...prev,
//       [semesterId]: !prev[semesterId],
//     }));
//   };

//   return (
//     <>
//       <div className="p-8 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">Semesters</h1>
//           <button
//             onClick={() => {
//               if (showForm) {
//                 resetForm();
//                 setShowForm(false);
//               } else {
//                 setShowForm(true);
//               }
//             }}
//             className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition-shadow shadow-md"
//           >
//             {showForm ? "Close" : "+ Create Semester"}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-blue-50 border border-blue-300 rounded-lg p-8 mb-10 shadow-inner">
//             <h2 className="text-xl font-semibold text-blue-900 mb-6">Create New Semester</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="semesterNumber" className="block font-semibold mb-2 text-gray-700">
//                   Semester Number
//                 </label>
//                 <input
//                   id="semesterNumber"
//                   type="text"
//                   placeholder="e.g., 1"
//                   value={semesterNumber}
//                   onChange={(e) => setSemesterNumber(e.target.value)}
//                   className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="startDate" className="block font-semibold mb-2 text-gray-700">
//                   Start Date
//                 </label>
//                 <input
//                   id="startDate"
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="department" className="block font-semibold mb-2 text-gray-700">
//                   Department
//                 </label>
//                 <input
//                   id="department"
//                   type="text"
//                   placeholder="e.g., Computer Science"
//                   value={department}
//                   onChange={(e) => setDepartment(e.target.value)}
//                   className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="university" className="block font-semibold mb-2 text-gray-700">
//                   University
//                 </label>
//                 <select
//                   id="university"
//                   value={university}
//                   onChange={(e) => setUniversity(e.target.value)}
//                   className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="" disabled>
//                     Select University
//                   </option>
//                   {campus.length > 0 ? (
//                     campus.map((uni) => (
//                       <option key={uni.id} value={uni.name}>
//                         {uni.name}
//                       </option>
//                     ))
//                   ) : (
//                     <option disabled>No universities found</option>
//                   )}
//                 </select>
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block font-semibold mb-2 text-gray-700">Select Courses</label>
//               <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
//                 {courses.length > 0 ? (
//                   courses.map((course) => (
//                     <div key={course.id} className="flex items-center mb-2">
//                       <input
//                         id={`course-${course.id}`}
//                         type="checkbox"
//                         checked={selectedCourses.includes(course.id)}
//                         onChange={() => handleCourseSelection(course.id)}
//                         className="mr-3 w-5 h-5 cursor-pointer"
//                       />
//                       <label htmlFor={`course-${course.id}`} className="cursor-pointer">
//                         {course.name}
//                       </label>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No courses available.</p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               className="mt-8 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-shadow shadow-md font-semibold"
//             >
//               Submit Semester
//             </button>
//           </div>
//         )}

//         {/* Display Semesters with University, Courses, and Delete Button */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {semesters.length > 0 ? (
//             semesters.map((semester) => {
//               const coursesToShow = courseToggle[semester.id]
//                 ? semester.course
//                 : semester.course?.slice(0, 2);

//               return (
//                 <div
//                   key={semester.id}
//                   className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition"
//                 >
//                   <h2 className="text-xl font-bold text-blue-900 mb-2">Semester {semester.sem}</h2>
//                   <p className="text-sm text-gray-600 mb-1">
//                     University: {semester.university || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-2">Department: {semester.department}</p>
//                   <div className="mb-4">
//                     <p className="font-semibold text-gray-700 mb-1">Courses:</p>
//                     <ul className="list-disc list-inside text-gray-700">
//                       {coursesToShow?.map((courseName, index) => (
//                         <li key={index}>{courseName}</li>
//                       ))}
//                     </ul>
//                     {semester.course && semester.course.length > 2 && (
//                       <p
//                         className="text-blue-600 cursor-pointer mt-1"
//                         onClick={() => toggleCourseList(semester.id)}
//                       >
//                         {courseToggle[semester.id] ? "Show less" : "Read more"}
//                       </p>
//                     )}
//                   </div>
//                   {/* ✅ FIXED delete button */}
//                   <div className="gap-10">
//                   <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Edit</button>
//                   <button
//                     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//                     onClick={() =>
//                       handleDelete(semester.university, semester.department, semester.sem)
//                     }
//                   >
//                     Delete
//                   </button>
//                 </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-500">No semesters found.</p>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//           onClick={() => setModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3
//               className={`text-xl font-bold mb-4 ${
//                 modalType === "error"
//                   ? "text-red-600"
//                   : modalType === "success"
//                   ? "text-green-600"
//                   : "text-gray-900"
//               }`}
//             >
//               {modalType === "error"
//                 ? "Error"
//                 : modalType === "success"
//                 ? "Success"
//                 : "Info"}
//             </h3>
//             <p className="mb-6">{modalMessage}</p>
//             <button
//               onClick={() => setModalOpen(false)}
//               className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default SemesterList;




import axios from "axios";
import { useEffect, useState } from "react";

function SemesterList() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [campus, setCampus] = useState([]); 

  const [selectedCourses, setSelectedCourses] = useState([]); 
  const [semesterNumber, setSemesterNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const [showForm, setShowForm] = useState(false);

  // ✅ NEW: Edit States
  const [editMode, setEditMode] = useState(false);
  const [editSemId, setEditSemId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); 

  const [courseToggle, setCourseToggle] = useState({}); 

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    fetchCourses();
    fetchSemesters();
    fetchUniversities();
  }, []);

  const handleDelete = (uniName, dept, semNumber) => {
    axios
      .delete(`${import.meta.env.VITE_SEM_DELETE}/${uniName}/${dept}/${semNumber}/`, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        showModal("Semester deleted successfully.", "success");
        fetchSemesters();
      })
      .catch((err) => {
        console.error("Failed to delete semester:", err);
        showModal("Failed to delete semester. Check console for details.", "error");
      });
  };

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        showModal("Failed to fetch courses. Check console.", "error");
      });
  };

  const fetchSemesters = () => {
    axios
      .get(import.meta.env.VITE_View_Semester, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setSemesters(res.data))
      .catch((err) => {
        console.error("Failed to fetch semesters", err);
        showModal("Failed to fetch semesters. Check console.", "error");
      });
  };

  const fetchUniversities = () => {
    axios
      .get(import.meta.env.VITE_VIEW_UNIVERSITY, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCampus(res.data))
      .catch((err) => {
        console.error("Failed to fetch universities", err);
        showModal("Failed to fetch universities. Check console.", "error");
      });
  };

  const handleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const resetForm = () => {
    setSemesterNumber("");
    setStartDate("");
    setDepartment("");
    setSelectedCourses([]);
    setUniversity("");
    setEditMode(false);
    setEditSemId(null);
  };

  const showModal = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!semesterNumber || !startDate || !department || !university) {
      showModal("Please fill all required fields.", "error");
      return;
    }

    const payload = {
      course_ids: selectedCourses,
      sem: semesterNumber,
      start_date: startDate,
      department: department,
      university: university,
    };

    axios
      .post(import.meta.env.VITE_Create_Semester, payload, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        showModal("Semester created successfully.", "success");
        resetForm();
        setShowForm(false);
        fetchSemesters();
      })
      .catch((err) => {
        console.error("Semester creation failed:", err);
        showModal("Semester creation failed. Check console for details.", "error");
      });
  };

  // ✅ NEW: Handle Edit
  const handleEdit = (semester) => {
    setSemesterNumber(semester.sem);
    setStartDate(semester.start_date || "");
    setDepartment(semester.department);
    setUniversity(semester.university);
    setSelectedCourses(semester.course_ids || []); 
    setEditMode(true);
    setEditSemId(semester.id);
    setShowForm(true);
  };

  const handleEditSubmit = () => {
    if (!semesterNumber || !startDate || !department || !university) {
      showModal("Please fill all required fields.", "error");
      return;
    }

    const payload = {
      course_ids: selectedCourses,
      sem: semesterNumber,
      start_date: startDate,
      department: department,
      university: university,
    };

    axios
      .put(
        `${import.meta.env.VITE_EDIT_SEM}/${university}/${department}/${semesterNumber}`,
        payload,
        {
          headers: { Authorization: `Basic ${token}` },
        }
      )
      .then(() => {
        showModal("Semester updated successfully.", "success");
        resetForm();
        setShowForm(false);
        fetchSemesters();
      })
      .catch((err) => {
        console.error("Semester update failed:", err);
        showModal("Semester update failed. Check console for details.", "error");
      });
  };

  const toggleCourseList = (semesterId) => {
    setCourseToggle((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }));
  };

  return (
    <>
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Semesters</h1>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
                setShowForm(false);
              } else {
                setShowForm(true);
              }
            }}
            className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition-shadow shadow-md"
          >
            {showForm ? "Close" : "+ Create Semester"}
          </button>
        </div>

        {showForm && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-8 mb-10 shadow-inner">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">
              {editMode ? "Edit Semester" : "Create New Semester"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="semesterNumber" className="block font-semibold mb-2 text-gray-700">
                  Semester Number
                </label>
                <input
                  id="semesterNumber"
                  type="text"
                  placeholder="e.g., 1"
                  value={semesterNumber}
                  onChange={(e) => setSemesterNumber(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block font-semibold mb-2 text-gray-700">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="department" className="block font-semibold mb-2 text-gray-700">
                  Department
                </label>
                <input
                  id="department"
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="university" className="block font-semibold mb-2 text-gray-700">
                  University
                </label>
                <select
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select University
                  </option>
                  {campus.length > 0 ? (
                    campus.map((uni) => (
                      <option key={uni.id} value={uni.name}>
                        {uni.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No universities found</option>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-semibold mb-2 text-gray-700">Select Courses</label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.id} className="flex items-center mb-2">
                      <input
                        id={`course-${course.id}`}
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseSelection(course.id)}
                        className="mr-3 w-5 h-5 cursor-pointer"
                      />
                      <label htmlFor={`course-${course.id}`} className="cursor-pointer">
                        {course.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No courses available.</p>
                )}
              </div>
            </div>

            <button
              onClick={editMode ? handleEditSubmit : handleSubmit}
              className="mt-8 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-shadow shadow-md font-semibold"
            >
              {editMode ? "Update Semester" : "Submit Semester"}
            </button>
          </div>
        )}

        {/* Display Semesters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {semesters.length > 0 ? (
            semesters.map((semester) => {
              const coursesToShow = courseToggle[semester.id]
                ? semester.course
                : semester.course?.slice(0, 2);

              return (
                <div
                  key={semester.id}
                  className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-bold text-blue-900 mb-2">Semester {semester.sem}</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    University: {semester.university || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Department: {semester.department}</p>
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-1">Courses:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {coursesToShow?.map((courseName, index) => (
                        <li key={index}>{courseName}</li>
                      ))}
                    </ul>
                    {semester.course && semester.course.length > 2 && (
                      <p
                        className="text-blue-600 cursor-pointer mt-1"
                        onClick={() => toggleCourseList(semester.id)}
                      >
                        {courseToggle[semester.id] ? "Show less" : "Read more"}
                      </p>
                    )}
                  </div>
                  <div className="gap-10 flex">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      onClick={() => handleEdit(semester)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() =>
                        handleDelete(semester.university, semester.department, semester.sem)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No semesters found.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                modalType === "error"
                  ? "text-red-600"
                  : modalType === "success"
                  ? "text-green-600"
                  : "text-gray-900"
              }`}
            >
              {modalType === "error"
                ? "Error"
                : modalType === "success"
                ? "Success"
                : "Info"}
            </h3>
            <p className="mb-6">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SemesterList;
