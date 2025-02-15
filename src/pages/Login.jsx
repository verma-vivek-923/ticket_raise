import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
} from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

// useEffect(() => {
//   validateForm();
// }, [email,password])



  // Form validation before submission
  const validateForm = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required!";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format!";
    }

    if (!password) {
      newErrors.password = "Password is required!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch role from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        navigate("/dashboard");
      } else {
        toast.error("User role not found.");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let role;
      if (!userSnap.exists()) {
        const { value: selectedRole } = await Swal.fire({
          title: "Select Your Role",
          input: "select",
          inputOptions: { customer: "Customer", support: "Support Team" },
          inputPlaceholder: "Choose a role",
          showCancelButton: true,
        });

        if (!["customer", "support"].includes(selectedRole)) {
          setLoading(false);
          return toast.error("Invalid role!");
        }

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: selectedRole,
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login Error:", error.message);
      toast.error("Google sign-in failed!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col relative items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-4xl font-bold mb-4">
        Ticket<span className="text-blue-600">ly</span>
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full mb-10 max-w-md">
        <h2 className="text-2xl text-center font-semibold mb-1">Login</h2>
        <p className="text-gray-600 text-center mb-4">It's quick and easy.</p>
        <form onSubmit={handleEmailLogin}>
          {/* Email Input */}
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              placeholder="Email address"
              value={email}
              onBlur={validateForm}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded-md mb-2 focus:bg-slate-100 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="absolute right-4 top-2 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onBlur={validateForm}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-md mb-2 focus:bg-slate-100 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="absolute right-4 top-2 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 mt-2 text-white py-2 rounded-md md:font-semibold hover:bg-green-700"
          >
            {!loading ? (
              "Log In"
            ) : (
              <div className="flex justify-center items-center space-x-2">
                <Loading />
                <span>Logging In...</span>
              </div>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <p className="text-xl mt-2 text-center">OR</p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-1 flex border-2 border-slate-700 rounded-lg justify-evenly my-2 items-center px-8"
        >
          <FaGoogle size={20} /> <p className="text-lg">Continue with Google</p>
        </button>

        {/* Signup Link */}
        <p className="text-center mt-4">
          Not registered yet?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
