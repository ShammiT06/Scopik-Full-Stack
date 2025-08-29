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

  // 🔥 new states for editing
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
      .catch((err) => {
        console.log("There is an error", err);
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
      } catch (err) {
        console.error("Image upload error:", err);
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

  // 🔥 start editing blog
  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setImageUrls(blog.image_urls || []);
    setEditTitle(blog.title); // original title used in API URL
    setAdd(true);
    setEditMode(true);
  };

  // 🔥 update blog API call
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
      .catch((err) => {
        console.error("Update error:", err);
        setPopupMessage("Failed to update blog.");
      });
  };

  return (
    <div className="relative max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow">
      {/* ? Popup Message */}
      {popupMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
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

      {/* ? Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Blogs</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setAddCategory(!addCategory)}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 text-white rounded-lg font-medium shadow"
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
            className="bg-green-600 hover:bg-green-700 px-5 py-2 text-white rounded-lg font-medium shadow"
          >
            + Add Blog
          </button>
        </div>
      </div>

      {/* ? Add Category Form */}
      {addCategory && (
        <div className="bg-gray-50 p-4 rounded-lg shadow mb-6 flex gap-4 items-center max-w-md">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="border border-gray-300 rounded-lg p-2 flex-1"
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

      {/* ? Blog Form */}
      {add && (
        <div className="bg-gray-100 p-6 rounded-lg shadow space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-medium mb-1">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                className="border border-gray-300 rounded-lg p-3 text-gray-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-300 rounded-lg p-3 text-gray-800"
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
              <label className="text-sm text-gray-600 font-medium mb-1">
                Blog Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Write blog content..."
                className="border border-gray-300 rounded-lg p-3 text-gray-800"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm text-gray-600 font-medium mb-1">
                Upload Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer border-2 border-dashed border-gray-400 p-4 rounded-lg"
              />
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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

          <div className="flex justify-end mt-4 gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 text-white rounded-lg font-semibold"
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
                  className="bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg font-semibold"
              >
                Save Blog
              </button>
            )}
          </div>
        </div>
      )}

      {/* ? Blog Display Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Blog Content
        </h2>
        <div className="grid md:grid-cols-3 gap-6 h-[400px] overflow-y-scroll pr-2">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border p-4 flex flex-col justify-between"
            >
              <img
                src={blog.image_urls?.[0]}
                alt={blog.title}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3 text-justify">
  {blog.content}
</p>

              <div className="flex gap-2 mt-auto">
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
