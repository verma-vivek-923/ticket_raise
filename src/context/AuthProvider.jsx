import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user role from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          setUserRole(null);
          navigate("/"); // Redirect if no role found
        }
      } else {
        setUser(null);
        setUserRole(null);
        navigate("/"); // Redirect if not logged in
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, logout }}>
      {!loading ? children : <p>Loading...jjjj</p>}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
