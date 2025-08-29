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
    <div className="max-w-7xl mx-auto px-4 rounded-lg bg-white pb-10">
      {/* Header */}
      <div className="bg-white flex justify-between items-center p-5 rounded-md">
        <h1 className="text-xl font-bold text-black">Categories</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl p-6 rounded-md shadow-md space-y-4 border border-gray-100 relative">
            <button
              className="absolute top-3 right-5 text-gray-500 hover:text-red-600 text-3xl font-bold"
              onClick={resetForm}
            >
              ×
            </button>

            <div className="flex items-center justify-center gap-5">
              <label className="w-40 font-medium text-black">
                Category Name:
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border p-2 w-96 rounded-md focus:outline-blue-400"
              />
            </div>

            <div className="flex items-center justify-center gap-5">
              <label className="w-40 font-medium text-black">
                Upload Image:
              </label>
              <label className="w-96 p-3 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-blue-400 transition relative">
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
                  className="bg-blue-600 text-white px-6 py-2 mb-8 rounded hover:bg-blue-700"
                  onClick={handleSaveCategory}
                >
                  {editing ? "Update Category" : "Save Category"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white flex flex-col justify-center items-center p-6 rounded-lg shadow-md w-full max-w-md text-center relative">
            {/* <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowDeleteModal(false)}
            >
              ×
            </button> */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this category?
            </h2>
            <p className="text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
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
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all p-4 flex flex-col items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="mt-3 text-center font-semibold text-black text-lg">
              {item.name}
            </h2>
            <div className="mt-4 flex gap-6">
              {/* <img
                src={edit}
                alt="edit"
                className="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100"
                title="Edit"
                onClick={() => handleEdit(item.name)}
              /> */}
              {/* <img
                src={del}
                alt="delete"
                onClick={() => handleDelete(item.name)}
                className="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100"
                title="Delete"
              /> */}
              <button
                className="border bg-green-600 text-white shadow-md px-6 py-2 rounded-full"
                onClick={() => handleEdit(item.name)}
              >
                Edit Category
              </button>
              <button
                className="border bg-red-500 text-white shadow-md px-6 py-2 rounded-full"
                onClick={() => {
                  setCategoryToDelete(item.name);
                  setShowDeleteModal(true);
                }}
              >
                Delete Category
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
