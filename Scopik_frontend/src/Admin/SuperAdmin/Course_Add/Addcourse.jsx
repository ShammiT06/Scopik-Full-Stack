import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

function CourseList({ onSuccess }) {
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [cardImage, setCardImage] = useState("");
  const [chapter, setChapter] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [uploadingCourseImage, setUploadingCourseImage] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  const username=import.meta.env.VITE_USER_NAME
  const password= import.meta.env.VITE_USER_PASS

  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    axios.get(import.meta.env.VITE_View_Category).then((res) => setCategories(res.data));
  }, []);

  const handleUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset",import.meta.env.VITE_CLOUD_PRESET);
    data.append("cloud_name",import.meta.env.VITE_CLOUD_NAME);

    if (key === "Image") setUploadingCardImage(true);
    if (key === "BackgroundImage") setUploadingCourseImage(true);

    try {
      const res = await fetch(import.meta.env.VITE_CLOUD_IMAGE, {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (key === "Image") setCardImage(result.url);
      else if (key === "BackgroundImage") setCourseImage(result.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      if (key === "Image") setUploadingCardImage(false);
      if (key === "BackgroundImage") setUploadingCourseImage(false);
    }
  };

  const handleSubmit = () => {
    const payload = {
      name: courseName,
      description: courseDesc,
      image: cardImage,
      total_chap: chapter,
      duration: duration,
      price: price,
      background_image: courseImage,
      categories: category,
    };

    axios.post(import.meta.env.VITE_Course, payload)
      .then(() => {
        setSuccessMessage("Course added successfully.");
        setSuccessModal(true);
        resetForm();
        onSuccess && onSuccess();
      })
      .catch((err) => console.error("Add failed:", err));
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDesc("");
    setCardImage("");
    setChapter("");
    setDuration("");
    setPrice("");
    setCourseImage("");
    setCategory([]);
  };

  const removeCategory = (catToRemove) => {
    setCategory((prev) => prev.filter((cat) => cat !== catToRemove));
  };

  const isFormComplete =
    courseName.trim() &&
    courseDesc.trim() &&
    cardImage &&
    chapter.trim() &&
    duration.trim() &&
    price.trim() &&
    courseImage &&
    category.length > 0 &&
    !uploadingCardImage &&
    !uploadingCourseImage;

  const handleModalOk = () => {
    setSuccessModal(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Success</h2>
            <p className="mb-6">{successMessage}</p>
            <button
              onClick={handleModalOk}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-[#084D90]">Add New Course</h1>

      <div className="space-y-5">
        {/* Categories */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Course Categories <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {category.map((cat) => (
              <span key={cat} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-red-500 hover:text-red-700 ml-1">×</button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected && !category.includes(selected)) {
                setCategory((prev) => [...prev, selected]);
              }
            }}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
            value=""
          >
            <option value="" disabled>Select category to add</option>
            {categories.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Input Fields */}
        <InputField label="Course Name" value={courseName} onChange={setCourseName} placeholder="Enter course name" required />
        <InputField label="Description" value={courseDesc} onChange={setCourseDesc} placeholder="Enter course description" textarea required />
        <InputField label="Total Chapters" value={chapter} onChange={setChapter} placeholder="Ex: 10" required />
        <InputField label="Duration" value={duration} onChange={setDuration} placeholder="Ex: 4 weeks" required />
        <InputField label="Price" value={price} onChange={setPrice} placeholder="Ex: 499" required />

        {/* Image Uploads */}
        <ImageUpload
          title="Card Image"
          resolution="480x400"
          uploading={uploadingCardImage}
          imageUrl={cardImage}
          onUpload={(e) => handleUpload(e, "Image")}
          required={true}
        />
        <ImageUpload
          title="Background Image"
          resolution="1440x480"
          uploading={uploadingCourseImage}
          imageUrl={courseImage}
          onUpload={(e) => handleUpload(e, "BackgroundImage")}
          required={true}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className={`w-full px-5 py-3 rounded-lg text-lg font-semibold transition ${
            isFormComplete
              ? "bg-[#084D90] text-white hover:bg-blue-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Submit Course
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, textarea = false, required = false }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
          required
        />
      )}
    </div>
  );
}

function ImageUpload({ title, resolution, uploading, imageUrl, onUpload, required = false }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">
        {title} {required && <span className="text-red-500">*</span>}
        <span className="text-sm text-gray-500"> ({resolution} px)</span>
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg w-full h-52 flex items-center justify-center hover:border-blue-400 transition relative group">
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          required={required && !imageUrl}
        />
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            <span className="text-blue-500 mt-2">Uploading...</span>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} className="h-full w-full object-cover rounded-lg" alt={title} />
        ) : (
          <p className="text-gray-500 text-center">
            Click or drag to upload <br />
            <span className="text-sm text-gray-400">Recommended: {resolution}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default CourseList;
