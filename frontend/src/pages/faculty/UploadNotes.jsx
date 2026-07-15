import { useState } from "react";
import { uploadNote } from "../../api/noteApi";

const UploadNotes = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    department: "",
    semester: "",
    description: "",
  });

  const [pdf, setPdf] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    setPdf(e.target.files[0]);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("department", formData.department);
      data.append("semester", formData.semester);
      data.append("description", formData.description);

      data.append("pdf", pdf);

      await uploadNote(data);

      alert("Note Uploaded Successfully!");

      setFormData({
        title: "",
        subject: "",
        department: "",
        semester: "",
        description: "",
      });

      setPdf(null);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Upload Failed");
    }
  };
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Notes</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter Note Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-2 font-medium">Subject</label>

          <input
            type="text"
            name="subject"
            placeholder="Enter Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-2 font-medium">Department</label>

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="MBA">MBA</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block mb-2 font-medium">Semester</label>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Semester</option>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            name="description"
            rows="4"
            placeholder="Write a short description..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block mb-2 font-medium">Upload PDF</label>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Upload Notes
        </button>
      </form>
    </div>
  );
};

export default UploadNotes;
