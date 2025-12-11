import React, { useState } from "react";
import Map from "../components/Map";
import ApartmentList from "../components/ApartmentList";
import { FaSearch, FaMapMarkerAlt, FaHome, FaFilter } from "react-icons/fa";
import { HiViewList, HiMap } from "react-icons/hi";

function Home() {
  const [view, setView] = useState("both"); // "both", "map", "list"
  const [searchTerm, setSearchTerm] = useState("");

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
        {/* Mapa */}
        {(view === "both" || view === "map") && (
          <div
            className={`${
              view === "both" ? "w-[400px]" : "flex-1"
            } h-full relative transition-all duration-300 z-10`}
          >
            <div className="h-full w-full">
              <Map />
            </div>
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
