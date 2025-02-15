// src/pages/SupportDashboard.js
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      setTickets(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchTickets();
  }, []);
  console.log(tickets);

  const handleStatusUpdate = async (id, newStatus) => {
    await updateDoc(doc(db, "tickets", id), { status: newStatus });
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  return (
    <div className="min-h-screen w-full px-2 flex flex-col justify-center items-center">
      <h3 className="text-2xl font-semibold text-center pt-4">All Tickets</h3>
      <table
        border={1}
        className="w-full mt-8 border-collapse border-2 border-gray-700"
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-900 p-2">S.no</th>
            <th className="border border-gray-900 p-2">Title</th>
            <th className="border border-gray-900 p-2">Status</th>
            <th className="border border-gray-900 p-2">Priority</th>
            <th className="border border-gray-900 p-2">Description</th>
            <th className="border border-gray-900 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id} className="border">
              <td className="border border-gray-500 p-2">{index + 1}</td>
              <td className="border border-gray-500 p-2">{ticket.title}</td>
              <td
                className={`border border-gray-500 font-bold p-2 ${
                  ticket.status === "resolved"
                    ? "text-green-800"
                    : ticket.status === "inprogess"
                    ? "text-orange-600"
                    : "text-orange-900"
                } `}
              >
                {ticket.status}
              </td>

              <td className="border border-gray-500 p-2">{ticket.priority}</td>
              <td className="border border-gray-500 p-2">
                {ticket.description}
              </td>
              <td className="border flex gap-2 flex-col border-gray-500 p-2">
                <button
                  onClick={() => handleStatusUpdate(ticket.id, "Resolved")}
                  className=" py-1 px-1 flex items-center justify-center bg-green-500 hover:bg-green-700 duration-200 text-black border rounded-lg border-slate-700"
                >
                  Mark as Resolve
                </button>
                <button
                  onClick={() => handleStatusUpdate(ticket.id, "in-progress")}
                  className=" py-1 px-1 flex items-center justify-center bg-orange-500 hover:bg-orange-700 duration-200 text-black border rounded-lg border-slate-700"
                >
                  Mark as In progess
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportDashboard;
