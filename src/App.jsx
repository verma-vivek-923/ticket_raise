import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RaiseTicket from './dashboard/RaiseTicket';
import { auth } from './firebaseConfig';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SupportDashboard from './pages/SupportDashboard';
import Ticket from './pages/Ticket';
import TicketDetail from './pages/TicketDetail';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; 

  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/signup" element={<Signup/>} />
        
        <Route exact path="/dashboard" element={<Dashboard/>} />
        {/* <Route exact path="/support-dashboard" element={<ProtectedRoute allowedRoles={["support-team"]}><SupportDashboard/></ProtectedRoute>} /> */}
        <Route exact path="/ticket/raise-ticket" element={<RaiseTicket/>} />
        
        <Route exact path="*" element={<Login/>} />
        
        <Route exact path="/ticket/:id" element={<TicketDetail />} />
      </Routes>
      {/* <Footer/> */}
      <Toaster />
    </>
  );
}

export default App