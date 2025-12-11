import React, { useState } from "react";
import Map from "../components/Map";
import ApartmentList from "../components/ApartmentList";
import { FaSearch, FaMapMarkerAlt, FaHome, FaFilter } from "react-icons/fa";
import { HiViewList, HiMap } from "react-icons/hi";

function Home() {
  const [view, setView] = useState("list"); // "both", "map", "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [mapActive, setMapActive] = useState(false);

  const handleMapActivation = () => {
    setMapActive(true);
  };

  return (
    <div className="h-[calc(100vh-82px)] bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col">
      {/* Barra superior con controles de vista - Siempre visible */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setView("both");
                  setMapActive(false);
                }}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  view === "both"
                    ? "bg-white shadow-md text-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <HiViewList />
                <span className="hidden md:inline">Ambos</span>
              </button>
              <button
                onClick={() => {
                  setView("map");
                  setMapActive(false);
                }}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  view === "map"
                    ? "bg-white shadow-md text-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <HiMap />
                <span className="hidden md:inline">Mapa</span>
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  view === "list"
                    ? "bg-white shadow-md text-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FaMapMarkerAlt />
                <span className="hidden md:inline">Lista</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay para desactivar el mapa cuando se hace clic fuera */}
        {mapActive && (
          <div
            className="absolute inset-0 z-10"
            onClick={() => setMapActive(false)}
          />
        )}

        {/* Mapa */}
        {(view === "both" || view === "map") && (
          <div
            className={`${
              view === "both" ? "w-[400px]" : "flex-1"
            } h-full relative transition-all duration-300 ${mapActive ? 'z-20' : 'z-10'}`}
          >
            {/* Mapa con efecto blur */}
            <div className={`h-full transition-all duration-300 ${!mapActive ? 'blur-sm' : ''}`}>
              <Map />
            </div>

            {/* Overlay para activar el mapa */}
            {!mapActive && (
              <div
                className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all"
                onClick={handleMapActivation}
              >
                <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                  <HiMap className="text-indigo-600 text-4xl" />
                  <p className="text-lg font-semibold text-gray-800">Activar mapa</p>
                  <p className="text-sm text-gray-500">Haz clic para interactuar</p>
                </div>
              </div>
            )}

            {view === "both" && mapActive && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Vista de mapa</span>
              </div>
            )}
          </div>
        )}

        {/* Lista de apartamentos */}
        {(view === "both" || view === "list") && (
          <div
            className={`${
              view === "both" ? "flex-1" : "flex-1"
            } h-full bg-white ${view === "both" ? "border-l" : ""} border-gray-200 transition-all duration-300 overflow-y-auto`}
          >
            {/* Header/Barra de búsqueda - Dentro del scroll */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Título y descripción */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                      <FaHome className="text-white text-2xl" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Encuentra tu hogar</h1>
                      <p className="text-sm text-gray-500">Explora apartamentos disponibles</p>
                    </div>
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por barrio o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header de la lista */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Apartamentos disponibles</h2>
                  <p className="text-sm text-gray-500">Selecciona uno para ver más detalles</p>
                </div>
                <button className="p-2 hover:bg-white rounded-lg transition-all">
                  <FaFilter className="text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Lista scrolleable */}
            <div className="px-4 py-4">
              <ApartmentList searchTerm={searchTerm} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
