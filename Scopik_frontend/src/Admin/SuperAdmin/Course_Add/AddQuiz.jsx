// import axios from "axios";
// import { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// function AddQuiz({ onSuccess, goToChapterStep }) {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState("");
//   const [chapters, setChapters] = useState([]);
//   const [quizzes, setQuizzes] = useState([]); 

//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const username = import.meta.env.VITE_USER_NAME;
//   const password = import.meta.env.VITE_USER_PASS;
//   const token = btoa(`${username}:${password}`);

//   useEffect(() => {
//     axios
//       .get(import.meta.env.VITE_Course_name, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setCourses(res.data);
//         } else {
//           console.error("Expected array, received:", res.data);
//           setCourses([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         setCourses([]);
//       });
//   }, []);

//   useEffect(() => {
//     const course = courses.find((c) => c.id == selectedCourseId);
//     setChapters(course?.chapters || []);
//   }, [selectedCourseId, courses]);


//   const bulklQuiz = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       const data = e.target.result;
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const quizsheet = XLSX.utils.sheet_to_json(worksheet);

//       console.log("Parsed Quiz Data:", quizsheet);
//       setQuizzes(quizsheet); 
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const uploadbulk = () => {
//     if (!quizzes.length) {
//       showModal("Please select and parse an Excel file first.");
//       return;
//     }

//     axios
//       .post(
//         import.meta.env.VITE_BULK_QUIZ,
//         { quizzes },
//         { headers: { Authorization: `Basic ${token}` } }
//       )
//       .then((res) => {
//         showModal("Quizzes uploaded successfully!");
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.error("Upload error:", err);
//         showModal("Failed to upload quizzes.");
//       });
//   };

//   const showModal = (message) => {
//     setModalMessage(message);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-screen-xl mx-auto">
//       {modalVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
//             <h2 className="text-xl font-semibold text-green-700">Notification</h2>
//             <p className="text-gray-700">{modalMessage}</p>
//             <button
//               onClick={closeModal}
//               className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <h1 className="text-2xl font-bold mb-6 text-center">Quiz Manager</h1>

//       {/* Step 1: Course Select */}
//       <div className="mb-6">
//         <label className="block font-medium mb-1">Select Course</label>
//         <select
//           className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={selectedCourseId}
//           onChange={(e) => setSelectedCourseId(e.target.value)}
//         >
//           <option value="">-- Select Course --</option>
//           {courses.map((course) => (
//             <option key={course.id} value={course.id}>
//               {course.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Step 2: Bulk Upload */}
//       {selectedCourseId && (
//         <div className="mb-6">
//           <label className="block font-medium mb-2">Bulk Upload Quiz</label>
//           <div className="border-2 border-dashed border-orange-500 rounded-lg p-6 text-center hover:bg-orange-50 transition">
//             <input
//               type="file"
//               accept=".xlsx, .xls"
//               onChange={bulklQuiz}
//               className="w-full text-center text-sm text-gray-600 file:mx-auto file:rounded-lg file:border file:border-orange-500 file:bg-orange-100 file:px-4 file:py-2 file:text-orange-700 file:cursor-pointer hover:file:bg-orange-200"
//             />
//             <p className="mt-2 text-sm text-gray-500">
//               Upload your Excel file (.xlsx / .xls)
//             </p>

//             {quizzes.length > 0 && (
//               <button
//                 onClick={uploadbulk}
//                 className="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
//               >
//                 Upload Quizzes ({quizzes.length})
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AddQuiz;












// // import axios from "axios";
// // import { useEffect, useState } from "react";
// // import * as XLSX from "xlsx"

// // function AddQuiz({ onSuccess, goToChapterStep }) {
// //   const [courses, setCourses] = useState([]);
// //   const [selectedCourseId, setSelectedCourseId] = useState("");
// //   const [selectedChapterId, setSelectedChapterId] = useState("");
// //   const [chapters, setChapters] = useState([]);

// //   const [showCreateForm, setShowCreateForm] = useState(false);
// //   const [quizzes, setQuizzes] = useState([]);

// //   const [question, setQuestion] = useState("");
// //   const [options, setOptions] = useState(["", "", "", ""]);
// //   const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [confirmationVisible, setConfirmationVisible] = useState(false);
// //   const [chapterConfirmationVisible, setChapterConfirmationVisible] = useState(false);
// //   const [modalMessage, setModalMessage] = useState("");

// //   const username=import.meta.env.VITE_USER_NAME
// //   const password= import.meta.env.VITE_USER_PASS

// //   const token = btoa(`${username}:${password}`);

// //   useEffect(() => {
// //     axios
// //       .get(import.meta.env.VITE_Course_name, {
// //         headers: { Authorization: `Basic ${token}` },
// //       })
// //       .then((res) => {
// //         if (Array.isArray(res.data)) {
// //           setCourses(res.data);
// //         } else {
// //           console.error("Expected array, received:", res.data);
// //           setCourses([]);
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Fetch error:", err);
// //         setCourses([]);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     const course = courses.find((c) => c.id == selectedCourseId);
// //     setChapters(course?.chapters || []);
// //     setSelectedChapterId("");
// //     setShowCreateForm(false);
// //     setQuizzes([]);
// //   }, [selectedCourseId, courses]);

// //   useEffect(() => {
// //     if (selectedChapterId) {
// //       const course = courses.find((c) => c.id == selectedCourseId);
// //       const chapter = course?.chapters.find((ch) => ch.id == selectedChapterId);
// //       setQuizzes(chapter?.quizzes || []);
// //     } else {
// //       setQuizzes([]);
// //     }
// //   }, [selectedChapterId, courses, selectedCourseId]);

// //   const handleCreateQuiz = () => {
// //     if (!question || options.some((opt) => !opt) || correctAnswerIndex === null) {
// //       showModal("Please fill all fields and select the correct answer.");
// //       return;
// //     }
// //     axios
// //       .post(import.meta.env.VITE_QUIZ, {
// //         question: question,
// //         option1: options[0],
// //         option2: options[1],
// //         option3: options[2],
// //         option4: options[3],
// //         correct_option: correctAnswerIndex + 1,
// //         chapter: selectedChapterId,
// //       })
// //       .then(() => {
// //         setConfirmationVisible(true);
// //       })
// //       .catch(() => showModal("Failed to create quiz."));
// //   };

// //   const showModal = (message) => {
// //     setModalMessage(message);
// //     setModalVisible(true);
// //   };

// //   const closeModal = () => {
// //     setModalVisible(false);
// //   };

// //   const handleConfirmNext = () => {
// //     setConfirmationVisible(false);
// //     setQuestion("");
// //     setOptions(["", "", "", ""]);
// //     setCorrectAnswerIndex(null);
// //   };

// //   const bulklQuiz=(event)=>{
// //     const data=event.target.files[0]
// //     const reader = new FileReader()
// //     reader.onload = function (e)
// //     {
// //       const data = e.target.result
// //       const workbook=XLSX.read(data,{type:"array"})
// //       console.log(workbook)
// //       const sheets=workbook.SheetNames[0]
// //       const worksheet=workbook.Sheets[sheets]
// //       const quizsheet=XLSX.utils.sheet_to_json(worksheet)
// //       console.log(quizsheet)
// //     }



// //     reader.readAsArrayBuffer(data)
// //   }

// //   const handleCancelNext = () => {
// //     setConfirmationVisible(false);
// //     setChapterConfirmationVisible(true); // 👈 Ask for another chapter
// //   };

// //   const handleAddAnotherChapterYes = () => {
// //     setChapterConfirmationVisible(false);
// //     if (goToChapterStep) goToChapterStep(); // 👈 Move to Step 2
// //   };

// //   const handleAddAnotherChapterNo = () => {
// //     setChapterConfirmationVisible(false);
// //     if (onSuccess) onSuccess(); // 👈 Fully close modal
// //   };

// //   return (
// //     <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-screen-xl mx-auto">
// //       {/* Error Modal */}
// //       {modalVisible && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
// //             <h2 className="text-xl font-semibold text-green-700">Notification</h2>
// //             <p className="text-gray-700">{modalMessage}</p>
// //             <button
// //               onClick={closeModal}
// //               className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
// //             >
// //               OK
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Quiz Added Modal */}
// //       {confirmationVisible && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
// //             <h2 className="text-xl font-semibold text-blue-700">Quiz Added!</h2>
// //             <p className="text-gray-700">Do you want to add another quiz?</p>
// //             <div className="flex gap-4 justify-center">
// //               <button
// //                 onClick={handleConfirmNext}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
// //               >
// //                 Yes
// //               </button>
// //               <button
// //                 onClick={handleCancelNext}
// //                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
// //               >
// //                 No
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Add Another Chapter Confirmation */}
// //       {chapterConfirmationVisible && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
// //             <h2 className="text-xl font-semibold text-purple-700">Add Another Chapter?</h2>
// //             <p className="text-gray-700">Do you want to create a new chapter?</p>
// //             <div className="flex gap-4 justify-center">
// //               <button
// //                 onClick={handleAddAnotherChapterYes}
// //                 className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
// //               >
// //                 Yes
// //               </button>
// //               <button
// //                 onClick={handleAddAnotherChapterNo}
// //                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
// //               >
// //                 No
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <h1 className="text-2xl font-bold mb-6 text-center">Quiz Manager</h1>

// //       {/* Course Select */}
// //       <div className="mb-4">
// //         <label className="block font-medium mb-1">Select Course</label>
// //         <select
// //           className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           value={selectedCourseId}
// //           onChange={(e) => setSelectedCourseId(e.target.value)}
// //         >
// //           <option value="">-- Select Course --</option>
// //           {courses.map((course) => (
// //             <option key={course.id} value={course.id}>
// //               {course.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Chapter Select */}
// //       {chapters.length > 0 && (
// //         <div className="mb-6">
// //           <label className="block font-medium mb-1">Select Chapter</label>
// //           <select
// //             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             value={selectedChapterId}
// //             onChange={(e) => setSelectedChapterId(e.target.value)}
// //           >
// //             <option value="">-- Select Chapter --</option>
// //             {chapters.map((ch) => (
// //               <option key={ch.id} value={ch.id}>
// //                 {ch.title}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}

// //       {/* Create Quiz Button */}
// //       {selectedChapterId && (
// //         <div className="flex flex-col sm:flex-row gap-4 mb-6">
// //           <button
// //             onClick={() => setShowCreateForm(true)}
// //             className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
// //           >
// //             Create Quiz
// //           </button>
// //         </div>
// //       )}

// //       {/* Quiz Form */}
// //       {/* {showCreateForm && (
// //         <div className="space-y-4 border-t pt-6">
// //           <h2 className="text-xl font-semibold mb-2">Create New Quiz</h2>
// //           <div>
// //             <label className="block font-medium mb-1">Question</label>
// //             <input
// //               type="text"
// //               className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //             />
// //           </div>

// //           {options.map((opt, index) => (
// //             <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
// //               <input
// //                 type="checkbox"
// //                 checked={correctAnswerIndex === index}
// //                 onChange={() => setCorrectAnswerIndex(index)}
// //               />
// //               <input
// //                 type="text"
// //                 placeholder={`Option ${index + 1}`}
// //                 value={opt}
// //                 onChange={(e) => {
// //                   const newOpts = [...options];
// //                   newOpts[index] = e.target.value;
// //                   setOptions(newOpts);
// //                 }}
// //                 className="flex-grow border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           ))}

// //           <button
// //             onClick={handleCreateQuiz}
// //             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4 w-full sm:w-auto"
// //           >
// //             Save Quiz
// //           </button>
// //         </div>
// //       )} */}
// //       <input type="file" onChange={bulklQuiz} />
      
// //     </div>
// //   );
// // }

// // export default AddQuiz;





import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function AddQuiz({ onSuccess, goToChapterStep }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]); 

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error("Expected array, received:", res.data);
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setCourses([]);
      });
  }, []);

  useEffect(() => {
    const course = courses.find((c) => c.id == selectedCourseId);
    setChapters(course?.chapters || []);
  }, [selectedCourseId, courses]);


  const bulklQuiz = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const quizsheet = XLSX.utils.sheet_to_json(worksheet);

      console.log("Parsed Quiz Data:", quizsheet);
      setQuizzes(quizsheet); 
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadbulk = () => {
    if (!quizzes.length) {
      showModal("Please select and parse an Excel file first.");
      return;
    }

    axios
      .post(
        import.meta.env.VITE_BULK_QUIZ,
        { quizzes },
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then((res) => {
        showModal("Quizzes uploaded successfully!");
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Upload error:", err);
        showModal("Failed to upload quizzes.");
      });
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-screen-xl mx-auto dark:bg-slate-900">
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
            <h2 className="text-xl font-semibold text-green-700">Notification</h2>
            <p className="text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center dark:text-orange-300">Quiz Manager</h1>

      {/* Step 1: Course Select */}
      <div className="mb-6">
        <label className="block font-medium mb-1  dark:text-white">Select Course</label>
        <select
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Bulk Upload */}
      {selectedCourseId && (
        <div className="mb-6">
          <label className="block font-medium mb-2  dark:text-white">Bulk Upload Quiz</label>
          <div className="border-2 border-dashed border-orange-500 rounded-lg p-6 text-center hover:bg-orange-50 transition">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={bulklQuiz}
              className="w-full text-center text-sm text-gray-600 file:mx-auto file:rounded-lg file:border file:border-orange-500 file:bg-orange-100 file:px-4 file:py-2 file:text-orange-700 file:cursor-pointer hover:file:bg-orange-200"
            />
            <p className="mt-2 text-sm text-gray-500">
              Upload your Excel file (.xlsx / .xls)
            </p>

            {quizzes.length > 0 && (
              <button
                onClick={uploadbulk}
                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Upload Quizzes ({quizzes.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddQuiz;