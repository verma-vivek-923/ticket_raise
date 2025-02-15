import React from "react";
import { auth, db } from "../firebaseConfig";
import { MdDelete } from "react-icons/md";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyTicket = () => {
  const [tickets, setTickets] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTickets = async () => {
      const q = query(
        collection(db, "tickets"),
        where("createdBy.uid", "==", auth.currentUser.uid)
      );
      try {
        const querySnapshot = await getDocs(q);

        setTickets(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        console.log("User Tickets:", tickets);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      }
    };

    fetchTickets();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tickets", id));
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };
  console.log(tickets);

  return (
    <div className="min-h-screen flex flex-col  px-2   ">
      <h3 className="text-2xl font-semibold text-left ml-16 pt-4">My Tickets</h3>
      {/* <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            {ticket.title} - {ticket.status}
            <button onClick={() => handleDelete(ticket.id)}>Delete</button>
          </li>
        ))}
      </ul> */}
      <table
        border={1}
        className="w-full mt-8 table-auto border-collapse border-2  border-gray-700"
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
          {tickets.map((ticket,index) => (
            <tr key={ticket.id} className="border">
              <td className="border border-gray-500 p-2">{index+1}</td>
              <td className="border border-gray-500 p-2">{ticket.title}</td>
              <td className={`border border-gray-500 font-bold p-2 ${ticket.status==="resolved" ? "text-green-800" :ticket.status==="inprogess"?"text-orange-600":"text-orange-900"} `}>{ticket.status}</td>
              
              <td className="border border-gray-500 p-2">{ticket.priority}</td>
              <td className="border border-gray-500 p-2">
                {ticket.description}
              </td>
              <td className="border flex flex-col border-gray-500 p-2">
                <button onClick={handleDelete} className=" py-1 px-1 flex items-center justify-center bg-red-500 hover:bg-red-700 duration-200 text-black border rounded-lg border-slate-700"><MdDelete size={24} /></button>
                
                {/* <button className="py-1 px-2 bg-transparent border border-slate-700">Mark as resolve</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link
        to={"/ticket/raise-ticket"}
        className="px-2 py-1 border-2 w-max mt-12 bg-blue-600 text-stone-50 rounded-md border-slate-500"
      >
        Raise Ticket
      </Link>
    </div>
  );
};

export default MyTicket;
