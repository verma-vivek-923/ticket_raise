import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { IoHome } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import Loading from '../components/Loading';

const Signup = () => {
    const navigateTo = useNavigate();

    // const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
      setLoading(true);

        if (!["customer", "support-team"].includes(role)) {
          toast("Please select a valid role (customer/support)");
          return;
        }
    
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
    
          // Store user info in Firestore
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            role,
          });
          toast.success("Signup Successfully");
          setLoading(false);
          navigateTo("/dashboard");
        } catch (error) {
          console.error("Signup Error:", error.message);
          toast.error( error.message);
        }
      };
  

    return (
        <div className="flex flex-col relative items-center justify-center min-h-screen bg-slate-100">
          <Link
            to={"/"}
            className=" absolute top-4 left-4 px-2 md:px-10 flex items-center space-x-1"
          >
            <IoHome />
            <span>Home</span>
          </Link>
    
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl text-center font-semibold mb-1">
              Create a new account
            </h2>
            <p className="text-gray-600 text-center mb-4">It's quick and easy.</p>
            <form onSubmit={handleSignup}>
              <div className="flex gap-2 mb-3 justify-between">
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="p-2 focus:bg-slate-100 border border-gray-300 rounded-md w-1/2"
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="support-team">Support team</option>
                </select>
    
              
              </div>
    
              {/* <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  name={name}
                  placeholder="Your Full Name"
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 focus:bg-slate-100 border border-gray-300 rounded-md"
                />
              </div> */}
    
            
              <input
                type="text"
                name={email}
                autoComplete="off"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border focus:bg-slate-100 border-gray-300 rounded-md mb-3"
              />
    
              <input
                type="password"
                name={password}
                autoComplete="off"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 focus:bg-slate-100 border border-gray-300 rounded-md mb-4"
              />
            
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-green-600 mt-2 text-white py-2 rounded-md font-semibold hover:bg-green-700"
              >
                {!loading ? (
                  "SignUp"
                ) : (
                  <div className="flex justify-center items-center space-x-2">
                    <Loading/>
                    <span>Registering...</span>
                  </div>
                )}
              </button>
              <p className="text-center mt-4">
                Already registered?{" "}
                <Link to={"/login"} className="text-blue-600 hover:underline">
                  Login Now
                </Link>
              </p>
            </form>
          </div>
       
        </div>
      );
}

export default Signup