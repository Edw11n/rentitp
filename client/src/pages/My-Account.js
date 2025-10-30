import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileInvoiceDollar, faStar, faHistory, faTrashAlt, faChartBar } from "@fortawesome/free-solid-svg-icons";
import User from '../components/My-Account/User';
import Billing from '../components/My-Account/Billing';
import Stats from '../components/My-Account/Record';
import Reviews from '../components/My-Account/Reviews';
import Reservations from '../components/My-Account/Reservations';
import History from '../components/My-Account/History';

// Nota: Este archivo usa Tailwind CSS classes para un diseño más moderno y responsivo.

function MyAccount() {
    const [activeTab, setActiveTab] = useState("datos");

    // Función para renderizar dinámicamente el componente según el tab seleccionado
    const renderComponent = () => {
        switch (activeTab) {
            case "datos":
                return <User />;
            case "facturacion":
                return <Billing />
            case "estadisticas":
                return <Stats />
            case "reseñas":
                return <Reviews />
            case "reservas":
                return <Reservations />
            case "historial":
                return <History />
            case "eliminar":
                return <div>Eliminar cuenta</div>;
            default:
                return <User />;
        }
    };

    const tabs = [
        { key: 'datos', label: 'Mis datos', icon: faUser },
        { key: 'facturacion', label: 'Facturación', icon: faFileInvoiceDollar },
        { key: 'estadisticas', label: 'Estadísticas', icon: faChartBar },
        { key: 'reseñas', label: 'Reseñas', icon: faStar },
        { key: 'reservas', label: 'Reservas', icon: faHistory },
        { key: 'historial', label: 'Historial', icon: faHistory },
        { key: 'eliminar', label: 'Eliminar cuenta', icon: faTrashAlt, danger: true }
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto md:flex md:items-start md:gap-6">
                {/* Sidebar */}
                <aside className="md:w-64 w-full bg-white rounded-lg shadow-md p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Mi cuenta</h3>
                        <p className="text-sm text-gray-500">Administra tu información y preferencias</p>
                    </div>

                    <nav>
                        <ul className="space-y-2">
                            {tabs.map(tab => (
                                <li key={tab.key}>
                                    <button
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center w-full text-left gap-3 px-3 py-2 rounded-md transition-all duration-150 ${activeTab === tab.key ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                                        <span className="truncate">{tab.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>


                </aside>

                {/* Content area */}
                <main className="flex-1 mt-6 md:mt-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 capitalize">{tabs.find(t => t.key === activeTab)?.label || 'Mis datos'}</h2>
                        </div>

                        <div>
                            {renderComponent()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MyAccount;
