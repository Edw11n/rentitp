import React from "react";
import Map from '../components/Map';
import ApartmentList from "../components/ApartmentList";
import './Styles/Home.css';

function Home() {
    return (
        <div className="home-container">
            <div className="map-container">
                <Map />
            </div>
            <div className="apartment-list-container">
                <ApartmentList />
            </div>
        </div>
    );
}

export default Home;
