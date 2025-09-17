import axios from "axios";
import { useEffect, useState } from "react";

function Addblog() {
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [blogs, setBlogs] = useState([]);

  const [addCategory, setAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [bcategory, setBcategory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const fetchBlogs = () => {
    axios.get(import.meta.env.VITE_BLOG_VIEW).then((res) => {
      setBlogs(res.data);
    });
  };

  const fetchCategories = () => {
    axios.get(import.meta.env.VITE_BLOG_CAT).then((res) => {
      setBcategory(res.data || []);
    });
  };

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setPopupMessage("Category name cannot be empty.");
      return;
    }
    axios
      .post(import.meta.env.VITE_BLOG_CAT_ADD, {
        category_name: newCategory.trim(),
      })
      .then(() => {
        setPopupMessage("Category added successfully!");
        setNewCategory("");
        setAddCategory(false);
        fetchCategories();
      })
      .catch(() => {
        setPopupMessage("Failed to add category.");
      });
  };

  const handleSubmit = () => {
    if (!title || !category || imageUrls.length === 0) {
      setPopupMessage("Please fill in all fields and upload at least one image.");
      return;
    }

    axios
      .post(import.meta.env.VITE_BLOG_UPLOAD, {
        title,
        content,
        category,
        image_urls: imageUrls,
      })
      .then(() => {
        setPopupMessage("Blog added successfully!");
        setTitle("");
        setContent("");
        setCategory("");
        setImageUrls([]);
        setAdd(false);
        fetchBlogs();
      })
      .catch(() => {
        setPopupMessage("Blog upload failed. Please try again.");
      });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Scopik");

      try {
        const response = await fetch(import.meta.env.VITE_CLOUD_IMAGE, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          setPopupMessage("One or more image uploads failed.");
        }
      } catch {
        setPopupMessage("Image upload failed.");
      }
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
  };

  const handleDelete = (name) => {
    axios
      .delete(`${import.meta.env.VITE_BLOG_DELETE}${name}`)
      .then(() => {
        fetchBlogs();
        setPopupMessage("Blog deleted successfully");
      })
      .catch(() => {
        setPopupMessage("Failed to delete blog");
      });
  };

  const removeImage = (urlToRemove) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };
  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setImageUrls(blog.image_urls || []);
    setEditTitle(blog.title);
    setAdd(true);
    setEditMode(true);
  };
  const handleUpdate = () => {
    if (!title || !category || imageUrls.length === 0) {
      setPopupMessage("Please fill in all fields and upload at least one image.");
      return;
    }

    axios
      .put(`${import.meta.env.VITE_BLOG_EDIT}${editTitle}`, {
        title,
        content,
        category,
        image_urls: imageUrls,
      })
      .then(() => {
        setPopupMessage("Blog updated successfully!");
        setTitle("");
        setContent("");
        setCategory("");
        setImageUrls([]);
        setAdd(false);
        setEditMode(false);
        fetchBlogs();
      })
      .catch(() => {
        setPopupMessage("Failed to update blog.");
      });
  };

  return (
    <div className="relative max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow dark:bg-slate-800">
      {popupMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {popupMessage}
            </h2>
            <button
              onClick={() => setPopupMessage("")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-orange-400">Blogs</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setAddCategory(!addCategory)}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 text-white rounded-lg font-medium shadow w-full sm:w-auto"
          >
            + Blog Category
          </button>
          <button
            onClick={() => {
              setAdd(true);
              setEditMode(false);
              setTitle("");
              setContent("");
              setCategory("");
              setImageUrls([]);
            }}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 text-white rounded-lg font-medium shadow w-full sm:w-auto"
          >
            + Add Blog
          </button>
        </div>
      </div>
{addCategory && (
  <div className="bg-gray-50 dark:bg-slate-900 p-4 sm:p-3 rounded-lg shadow mb-6 
                  flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center max-w-md w-full">
    <input
      type="text"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      placeholder="Enter new category"
      className="border border-gray-300 rounded-lg p-2 flex-1 
                 dark:bg-slate-700 dark:text-white dark:border-slate-600"
    />
    <button
      onClick={handleAddCategory}
      className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg"
    >
      Add
    </button>
    <button
      onClick={() => {
        setAddCategory(false);
        setNewCategory("");
      }}
      className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:text-red-600"
    >
      ✖
    </button>
  </div>
)}
{add && (
  <div className="bg-gray-100 dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
          Blog Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter blog title"
          className="border border-gray-300 rounded-lg p-3 text-gray-800 
                     dark:bg-slate-700 dark:text-white dark:border-slate-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          className="border border-gray-300 rounded-lg p-3 text-gray-800 
                     dark:bg-slate-700 dark:text-white dark:border-slate-600"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {bcategory.map((cat, i) => (
            <option key={i} value={cat.Category}>
              {cat.Category}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col md:col-span-2">
        <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
          Blog Content <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Write blog content..."
          className="border border-gray-300 rounded-lg p-3 text-gray-800 
                     dark:bg-slate-700 dark:text-white dark:border-slate-600"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="flex flex-col md:col-span-2">
        <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
          Upload Images <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="cursor-pointer border-2 border-dashed border-gray-400 
                     dark:border-slate-600 p-4 rounded-lg"
        />
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {imageUrls.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  alt={`Uploaded ${i}`}
                  className="w-full h-[150px] object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(img)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
      {editMode ? (
        <>
          <button
            onClick={handleUpdate}
            className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 text-white rounded-lg font-semibold w-full sm:w-auto"
          >
            Update Blog
          </button>
          <button
            onClick={() => {
              setAdd(false);
              setEditMode(false);
              setTitle("");
              setContent("");
              setCategory("");
              setImageUrls([]);
            }}
            className="bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white rounded-lg font-semibold w-full sm:w-auto"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg font-semibold w-full sm:w-auto"
        >
          Save Blog
        </button>
      )}
    </div>
  </div>
)}
<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
  <div className="grid md:grid-cols-3 gap-6 h-[400px] overflow-y-scroll pr-2">
    {blogs.map((blog, index) => (
      <div
        key={index}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-md border p-4 flex flex-col justify-between"
      >
        <img
          src={blog.image_urls?.[0]}
          alt={blog.title}
          className="h-48 w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 text-justify">
          {blog.content}
        </p>
        <div className="flex justify-center gap-3 mt-auto">
          <button
            onClick={() => handleEdit(blog)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(blog.title)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

export default Addblog;