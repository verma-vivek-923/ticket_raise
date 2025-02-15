import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import MyTicket from '../dashboard/MyTicket';
import RaiseTicket from '../dashboard/RaiseTicket';
import Slider from '../dashboard/Slider'
import UpdateTicket from '../dashboard/UpdateTicket';
import SupportDashboard from './SupportDashboard';

const Dashboard = () => {
    const location=useLocation();
    const initial_component=location.state?.active_component || undefined;
    const [component,setComponent]=useState(initial_component);

    const {userRole}=useAuth();
    console.log(userRole);

    return (
        <div className='flex' >
          <div >
            <Slider component={component} setComponent={setComponent} />
          </div>
          <div>
            {userRole == "customer" ? <MyTicket/> : userRole === "support-team" ? <SupportDashboard/> : ("")}
                  
          </div>
        </div>
      )
}

export default Dashboard