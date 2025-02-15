import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch role from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          setUserRole(null);
          navigate("/"); // Redirect if role is missing
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

  if (loading) return <p>Loading...</p>;
  console.log(userRole)
  console.log(allowedRoles)

  return user && allowedRoles.includes(userRole) ? children : <p>Access Denied</p>;
};

export default ProtectedRoute;
