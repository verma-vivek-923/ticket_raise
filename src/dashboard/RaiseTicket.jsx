import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import Loading from "../components/Loading";

const RaiseTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigateTo = useNavigate();

  // Email validation function
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (!priority) newErrors.priority = "Priority is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails

    setLoading(true);
    try {
      await addDoc(collection(db, "tickets"), {
        title,
        description,
        category,
        priority,
        email,
        status: "Open",
        createdBy: {
          uid: auth.currentUser.uid, // Store User UID
          email: auth.currentUser.email, // Store User Email
        },
        createdAt: serverTimestamp(),
      });

      toast.success("Ticket raised successfully!");
      setTitle("");
      setDescription("");
      setPriority("");
      setCategory("");
      setEmail("");
      setLoading(false);
      navigateTo("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Try again later");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative items-center justify-center min-h-screen bg-slate-100">
      <Link
        to={"/dashboard"}
        className="absolute top-4 left-4 px-2 md:px-10 flex items-center space-x-1"
      >
        <IoHome />
        <span>Home</span>
      </Link>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl text-center font-semibold mb-1">
          Raise Ticket
        </h2>
        <p className="text-gray-600 text-center mb-4">It's quick and easy.</p>
        <form onSubmit={handleSubmit}>
          {/* Category & Priority Selection */}
          <div className="flex gap-2 mb-3 justify-between">
            <div className="w-1/2">
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`p-2 focus:bg-slate-100 border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } rounded-md w-full`}
              >
                <option value="">Select Category</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="account">Account Issue</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs">{errors.category}</p>
              )}
            </div>

            <div className="w-1/2">
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`p-2 focus:bg-slate-100 border ${
                  errors.priority ? "border-red-500" : "border-gray-300"
                } rounded-md w-full`}
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-xs">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter Title"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 focus:bg-slate-100 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Email address"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 focus:bg-slate-100 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <textarea
              type="text"
              placeholder="Describe Your issue in brief"
              autoComplete="off"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 focus:bg-slate-100 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 mt-2 text-white py-2 rounded-md font-semibold hover:bg-green-700"
          >
            {!loading ? (
              "Submit"
            ) : (
              <div className="flex justify-center items-center space-x-2">
                <Loading />
                <span>Submitting...</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
