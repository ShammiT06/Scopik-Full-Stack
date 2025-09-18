import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CourseContext } from "/src/App";

export default function Quizzes({ chapterId, onNextChapter, userEmail, courseName }) {
  const { Course } = useContext(CourseContext);
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLastChapter, setIsLastChapter] = useState(false);
  const [allChaptersCompleted, setAllChaptersCompleted] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [review, setReview] = useState("");
  const [chapterMarkedComplete, setChapterMarkedComplete] = useState(false);
  const [certificateDownloaded, setCertificateDownloaded] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false); // ? Completion modal state
  const [showGeneratingModal, setShowGeneratingModal] = useState(false); // ? Certificate generating modal state

  const navigate = useNavigate();
  const certificateKey = `certificateDownloaded_${userEmail}_${courseName}`;
  const completionKey = `chapterMarkedComplete_${userEmail}_${courseName}`;

  useEffect(() => {
    const certStatus = localStorage.getItem(certificateKey) === "true";
    setCertificateDownloaded(certStatus);

    const completeStatus = localStorage.getItem(completionKey) === "true";
    setChapterMarkedComplete(completeStatus);
  }, [certificateKey, completionKey]);

  useEffect(() => {
    if (!Course?.length || !chapterId) return;

    const matchedQuizzes = Course.flatMap((course) =>
      course.chapters
        ?.filter((ch) => String(ch.id) === String(chapterId))
        ?.map((ch) => {
          const courseChapters = course.chapters;
          const isLast = courseChapters[courseChapters.length - 1].id === ch.id;
          setIsLastChapter(isLast);
          setChapterTitle(ch.title);

          const saved = localStorage.getItem(`completed_${course.id}_${userEmail}`);
          if (saved) {
            const completedList = JSON.parse(saved);
            const completedIds = courseChapters.map((c) => c.id);
            const allDone = completedIds.every((id) => completedList.includes(id));
            setAllChaptersCompleted(allDone);
          }

          return (
            ch.quizzes?.map((quiz, idx) => ({
              ...quiz,
              chapterId: ch.id,
              chapterTitle: ch.title,
              quizIndex: idx,
            })) || []
          );
        })
        .flat()
    );

    setQuizzes(matchedQuizzes);
    setUserAnswers(new Array(matchedQuizzes.length).fill(null));
    setShowResult(false);
    setScore(0);
    setCurrentIndex(0);
  }, [chapterId, Course, userEmail]);

  const handleAnswer = (quizIndex, selectedOption) => {
    const updated = [...userAnswers];
    updated[quizIndex] = selectedOption;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    let correct = 0;
    quizzes.forEach((quiz, idx) => {
      if (String(userAnswers[idx]) === String(quiz.correct_options)) {
        correct++;
      }
    });
    setScore(correct);
    setShowResult(true);

    Course.forEach((course) => {
      const courseChapters = course.chapters.map((c) => c.id);
      if (courseChapters.includes(Number(chapterId))) {
        const key = `completed_${course.id}_${userEmail}`;
        const saved = localStorage.getItem(key);
        let completedList = saved ? JSON.parse(saved) : [];
        if (!completedList.includes(Number(chapterId))) {
          completedList.push(Number(chapterId));
          localStorage.setItem(key, JSON.stringify(completedList));
        }

        const allDone = courseChapters.every((id) => completedList.includes(id));
        setAllChaptersCompleted(allDone);
      }
    });
  };

  const handleRestart = () => {
    setUserAnswers(new Array(quizzes.length).fill(null));
    setShowResult(false);
    setScore(0);
    setCurrentIndex(0);
  };

  const handleNextChapter = () => {
    if (onNextChapter) {
      onNextChapter(chapterId);
    }
  };

  const handlecomplete = () => {
    axios
      .post("https://lmsdemo.thirdvizion.com/api/coursecompletestatus/", {
        email: userEmail,
        course: courseName,
      })
      .then(() => {
        setShowCompletionModal(true); // ? Open completion modal
        setChapterMarkedComplete(true);
        localStorage.setItem(completionKey, "true");

        if (onNextChapter) {
          onNextChapter(chapterId);
        }
      })
      .catch((err) => console.log("Error", err));
  };

  const handleCertificateRedirect = async () => {
    if (certificateDownloaded) {
      navigate("/certificate");
      return;
    }

    setShowGeneratingModal(true); // Show generating modal on start

    try {
      const feedbackPayload = {
        email: userEmail,
        course: courseName,
        feed: review,
      };

      const feedbackRes = await axios.post("https://lmsdemo.thirdvizion.com/api/getfeedback/", feedbackPayload);

      if (feedbackRes.status === 200 || feedbackRes.status === 201) {
        await axios.post(import.meta.env.VITE_CREATE_CERTIFICATE, {
          email: userEmail,
          course: courseName,
        });

        localStorage.setItem(certificateKey, "true");
        localStorage.setItem("completedCourseName", courseName);
        setCertificateDownloaded(true);
        setShowGeneratingModal(false); // Hide modal before redirect
        navigate("/certificate");
      } else {
        setShowGeneratingModal(false); // Hide modal on failure
        alert("Feedback submission failed. Try again.");
      }
    } catch (error) {
      setShowGeneratingModal(false); // Hide modal on error
      console.error("Error in certificate flow:", error);
      alert("Something went wrong while generating the certificate.");
    }
  };

  const needsRestart = showResult && score < quizzes.length;
  const showReviewInstead =
    showResult && score === quizzes.length && isLastChapter && allChaptersCompleted && chapterMarkedComplete;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white dark:bg-black rounded-lg shadow border border-zinc-700 text-white overflow-y-auto max-h-[calc(100vh-100px)]">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">
        Quiz for Chapter: {chapterTitle || `#${chapterId}`}
      </h2>

      {quizzes.length === 0 ? (
        <p className="text-gray-400">Loading or no quizzes available...</p>
      ) : showReviewInstead ? (
        <div className="p-6 rounded-lg border border-orange-500 bg-white dark:bg-black text-white shadow-lg">
          <p className="text-xl font-semibold mb-4 text-orange-400">
            You got {score} out of {quizzes.length} correct.
          </p>

          {!certificateDownloaded && (
            <>
              <label className="block mb-2 font-medium text-sm text-orange-300">
                Leave a quick review before claiming your certificate:
              </label>
              <textarea
                rows="3"
                placeholder="Your feedback..."
                className="w-full p-3 rounded bg-white dark:bg-black text-black dark:text-white border border-orange-500"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </>
          )}

          <button
            onClick={handleCertificateRedirect}
            className={`mt-4 px-4 py-2 rounded text-white transition ${
              certificateDownloaded ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {certificateDownloaded ? "View Certificate" : "Download Certificate"}
          </button>
        </div>
      ) : (
        <>
          {quizzes[currentIndex] && (
            <div className="mb-6 p-4 rounded-lg border border-zinc-700 bg-white dark:bg-black">
              <p className="font-semibold text-lg text-black dark:text-white mb-4">
                {currentIndex + 1}. {quizzes[currentIndex].question_text}
              </p>
              {[1, 2, 3, 4].map((opt) => (
                <label
                  key={opt}
                  className="block mb-2 cursor-pointer text-black dark:text-white hover:text-orange-400"
                >
                  <input
                    type="radio"
                    name={`quiz-${currentIndex}`}
                    value={opt}
                    checked={userAnswers[currentIndex] === opt}
                    onChange={() => handleAnswer(currentIndex, opt)}
                    className="mr-2 accent-orange-500"
                  />
                  {quizzes[currentIndex][`option${opt}`]}
                </label>
              ))}
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0 || showResult}
              className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white disabled:opacity-40"
            >
              Previous
            </button>

            {!showResult && currentIndex < quizzes.length - 1 && (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(quizzes.length - 1, i + 1))}
                className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next
              </button>
            )}
          </div>

          {!showResult && currentIndex === quizzes.length - 1 && (
            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
            >
              Submit Quiz
            </button>
          )}

          {showResult && (
            <div className="mt-8 p-6 rounded-lg border border-orange-500 bg-white dark:bg-black text-white shadow-lg">
              <p className="text-xl font-semibold mb-4 text-orange-400">
                You got {score} out of {quizzes.length} correct.
              </p>

              <div className="flex flex-wrap gap-3">
                {needsRestart && (
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Restart Quiz
                  </button>
                )}

                {score === quizzes.length && isLastChapter && allChaptersCompleted && chapterMarkedComplete && (
                  <button
                    onClick={handleCertificateRedirect}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    View Certificate
                  </button>
                )}

                {score === quizzes.length && isLastChapter && allChaptersCompleted && !chapterMarkedComplete && (
                  <button
                    onClick={handlecomplete}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Complete
                  </button>
                )}

                {score === quizzes.length && !isLastChapter && (
                  <button
                    onClick={handleNextChapter}
                    className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Unlock Next Chapter
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ? Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Congratulations!</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Your course has been marked as complete.</p>
            <button
              onClick={() => setShowCompletionModal(false)}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ? Certificate Generating Modal */}
      {showGeneratingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">
              Certificate Generating, please wait...
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

