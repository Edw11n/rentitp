import React from "react";
import Map from "../components/Map";
import ApartmentList from "../components/ApartmentList";

function Home() {
  return (
    <div className="flex h-[calc(100vh-82px)] overflow-hidden">
      {/* Mapa */}
      <div className="flex-[3] h-full">
        <Map />
      </div>

      {/* Lista de apartamentos */}
      <div className="flex-1 h-full p-2 shadow-inner overflow-y-auto">
        <ApartmentList />
      </div>
    </div>
  );
}

export default Home;
