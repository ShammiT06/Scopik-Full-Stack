import axios from "axios";
import { useEffect, useState } from "react";

function Category() {
  const [categories, setCategories] = useState([]);
  const [catImg, setCatImg] = useState("");
  const [desc, setDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editCatName, setEditCatName] = useState("");
  const [uploading, setUploading] = useState(false); // ?? Added state for loading spinner
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    axios.get(import.meta.env.VITE_View_Category).then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // ?? Start loading spinner

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Scopik");
    formData.append("cloud_name", "dm8wceqw2");

    try {
      const response = await fetch(
        import.meta.env.VITE_CLOUD_IMAGE,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setCatImg(data.url);
      setSaveEnabled(true);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false); // ? Stop loading spinner
    }
  };

  // const handleDelete = (categoryName) => {
  //   axios
  //     .delete(
  //       `https://lmsdemo.thirdvizion.com/api/deletecategory/${categoryName}`
  //     )
  //     .then(() => {
  //       setCategories((prev) =>
  //         prev.filter((item) => item.name !== categoryName)
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting category:", error);
  //     });
  // };

  const handleSaveCategory = () => {
    if (!desc) {
      alert("Please enter a category name.");
      return;
    }

    if (editing) {
      axios
        .put(
          `${import.meta.env.VITE_UPDATE_CAT}${editCatName}`,
          {
            category_name: desc,
            images: catImg,
          }
        )
        .then(() => {
          setCategories((prev) =>
            prev.map((item) =>
              item.name === editCatName
                ? { ...item, name: desc, image: catImg }
                : item
            )
          );
          resetForm();
          alert("Course Updated Successfully");
        })
        .catch((err) => {
          console.error("Error updating category:", err);
          alert("Update failed.");
        });
    } else {
      axios
        .post(import.meta.env.VITE_Category, {
          category_name: desc,
          images: catImg,
        })
        .then(() => {
          setCategories((prev) => [...prev, { name: desc, image: catImg }]);
          resetForm();
        })
        .catch(() => {
          console.error("Error adding category");
        });
    }
  };

  const handleEdit = (catName) => {
    const catToEdit = categories.find((cat) => cat.name === catName);
    if (!catToEdit) return;

    setEditCatName(catName);
    setDesc(catToEdit.name);
    setCatImg(catToEdit.image);
    setShowForm(true);
    setEditing(true);
    setSaveEnabled(true);
  };

  const resetForm = () => {
    setDesc("");
    setCatImg("");
    setSaveEnabled(false);
    setShowForm(false);
    setEditing(false);
    setEditCatName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 rounded-lg bg-white pb-10 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-md shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-orange-400 text-center sm:text-left">
            Categories
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl p-6 rounded-md shadow-md space-y-4 border border-gray-100 relative dark:bg-slate-900">
            <button
              className="absolute top-3 right-5 text-gray-500 hover:text-red-600 text-3xl font-bold"
              onClick={resetForm}
            >
              ×
            </button>

            {/* Responsive Input */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="w-full sm:w-40 font-medium text-black dark:text-white text-center sm:text-left">
                Category Name:
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border p-2 w-full sm:w-96 rounded-md focus:outline-blue-400 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="w-full sm:w-40 font-medium text-black dark:text-white text-center sm:text-left">
                Upload Image:
              </label>
              <label className="w-full sm:w-96 p-3 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-blue-400 transition relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCategoryImage}
                />
                {uploading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                    <span className="ml-2 text-blue-600">Uploading...</span>
                  </div>
                ) : catImg ? (
                  <img
                    src={catImg}
                    alt="Preview"
                    className="h-24 mx-auto object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Click to upload image</span>
                )}
              </label>
            </div>

            <div className="text-center">
              {saveEnabled && (
                <button
                  className="bg-blue-600 text-white px-6 py-2 mb-8 rounded hover:bg-blue-700 w-full sm:w-auto"
                  onClick={handleSaveCategory}
                >
                  {editing ? "Update Category" : "Save Category"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white flex flex-col justify-center items-center p-6 rounded-lg shadow-md w-full max-w-md text-center relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this category?
            </h2>
            <p className="text-gray-500 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
              <button
                onClick={() => {
                  axios
                    .delete(
                      `${import.meta.env.VITE_DELETE_CAT}${categoryToDelete}`
                    )
                    .then(() => {
                      setCategories((prev) =>
                        prev.filter((item) => item.name !== categoryToDelete)
                      );
                      setShowDeleteModal(false);
                    })
                    .catch((error) => {
                      console.error("Error deleting category:", error);
                      alert("Delete failed");
                    });
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Categories Grid */}
<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map((item, index) => (
    <div
      key={index}
      className="bg-white border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all 
                 p-4 flex flex-col items-center dark:bg-slate-800"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 sm:h-48 object-cover rounded-lg"
      />
      <h2 className="mt-3 text-center font-semibold text-black text-lg dark:text-white">
        {item.name}
      </h2>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
        <button
          className="flex-1 sm:flex-none bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => handleEdit(item.name)}
        >
          Edit
        </button>
        <button
          className="flex-1 sm:flex-none bg-red-500 text-white shadow-md px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => {
            setCategoryToDelete(item.name);
            setShowDeleteModal(true);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default Category;