import React from "react";
import ApartmentForm from "../components/ApartmentForm";
import Manage from '../components/Manage';

function Dashboard() {
  return (
    <div className="flex w-screen h-[calc(100vh-82px)] gap-4 bg-gray-100">

      {/* Formulario a la izquierda */}
      <div className="w-1/3 sticky top-0 max-h-screen overflow-y-auto p-4 bg-white rounded-r-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Añadir Apartamento</h2>
        <ApartmentForm />
      </div>

      {/* Gestión de apartamentos a la derecha */}
      <div className="w-2/3 max-h-screen overflow-y-auto p-4 bg-white rounded-l-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Mis Apartamentos</h2>
        <Manage />
      </div>

    </div>
  );
}

export default Dashboard;
