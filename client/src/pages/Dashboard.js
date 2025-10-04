import React from "react";
import ApartmentForm from "../components/ApartmentForm";
import Manage from '../components/Manage';
import '../styles/homes.css';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="form-section">
                <ApartmentForm />
            </div>
            <div className="manage-section">
                <Manage />
            </div>
        </div>
    );
}

export default Dashboard;