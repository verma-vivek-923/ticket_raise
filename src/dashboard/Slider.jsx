import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; // Firebase Config
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { CgProfile, CgCloseO } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";

const Slider = ({ setComponent }) => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleComponent = (value) => {
    setComponent(value);
    setShow(!show);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth); // Firebase logout
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to login page
    } catch (error) {
      toast.error("Error logging out!");
    }
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <div
        className="md:hidden sm:flex fixed top-4 left-4 z-50 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        {!show ? <AiOutlineMenuUnfold size={28} /> : <CgCloseO size={28} />}
      </div>

      {/* Sidebar Menu */}
      <div
        className={`transition-transform duration-500 rounded-md sm:-translate-x-full md:translate-x-0 w-40 lg:w-48 min-h-screen fixed md:relative top-0 left-0 z-40 py-6 pl-2 bg-white border 
        ${show ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Profile Section */}
        <div className="flex flex-col pt-12 items-center justify-center">
          <h1 className="text-3xl font-bold  mb-4">
            Ticket<span className="text-blue-600">ly</span>
          </h1>
        </div>

        {/* Sidebar Buttons */}
        <div className="space-y-1 mt-4">
          <button
            onClick={() => handleComponent("ticket")}
            className="flex justify-start focus:border-2 focus:border-blue-400 rounded-s-md items-center hover:text-blue-500 hover:tracking-wider hover:underline hover:font-bold duration-300 border-r-transparent py-2 px-6 w-full space-x-2"
          >
            <CgProfile size={20} />
            <h1 className="text-xl">Ticket</h1>
          </button>

          <button
            onClick={handleLogout}
            className="flex justify-start rounded-md items-center hover:text-red-600 hover:tracking-wider hover:underline hover:font-bold duration-300 border-r-transparent py-2 px-6 w-full space-x-2 text-red-500"
          >
            <TbLogout size={20} />
            <h1 className="text-xl">Logout</h1>
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      <div
        onClick={() => setShow(!show)}
        className={`${
          show ? "flex" : "hidden"
        } opacity-60 z-10 md:hidden absolute bg-slate-900 h-full w-full`}
      ></div>
    </div>
  );
};

export default Slider;
