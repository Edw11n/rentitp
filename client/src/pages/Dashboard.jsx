import React, { useState } from "react";
import ApartmentForm from "../components/ApartmentForm";
import Manage from '../components/Manage';
import Toast from '../components/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faChartLine } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('list'); // 'add', 'list', 'stats'
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleApartmentAdded = () => {
    setShowSuccessToast(true);
    setActiveTab('list');
  };

  return (
    <div className="min-h-[calc(100vh-82px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header con Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'list'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              Mis Apartamentos
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'add'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Añadir Apartamento
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mis Apartamentos</h1>
                  <p className="text-gray-600 mt-1">Gestiona tus propiedades publicadas</p>
                </div>
              </div>
              <Manage />
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Añadir Nuevo Apartamento</h1>
                <p className="text-gray-600 mt-1">Completa la información para publicar tu propiedad</p>
              </div>
              <ApartmentForm onApartmentAdded={handleApartmentAdded} />
            </div>
          </div>
        )}
      </div>

      {/* Notificación de apartamento añadido */}
      {showSuccessToast && (
        <Toast 
          message="¡Apartamento añadido exitosamente!" 
          type="success" 
          onClose={() => setShowSuccessToast(false)} 
        />
      )}
    </div>
  );
}

export default Dashboard;
