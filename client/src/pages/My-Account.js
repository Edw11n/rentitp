import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileInvoiceDollar, faStar, faHistory, faTrashAlt, faChartBar } from "@fortawesome/free-solid-svg-icons";
import User from '../components/My-Account/User';
import Billing from '../components/My-Account/Billing';
import Stats from '../components/My-Account/Record';
import Reviews from '../components/My-Account/Reviews';
import Reservations from '../components/My-Account/Reservations';
import History from '../components/My-Account/History';

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
                return <div>Eliminar cuenta (componente aquí)</div>;
            default:
                return <User />;
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ display: "flex" }}>
                <nav style={{ width: "250px", background: "#f4f4f4", padding: "10px" }}>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li 
                            onClick={() => setActiveTab("datos")} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", margin: "10px 0" }}
                        >
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
                            Mis datos
                        </li>
                        <li 
                            onClick={() => setActiveTab("facturacion")} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", margin: "10px 0" }}
                        >
                            <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: "10px" }} />
                            Facturación
                        </li>
                        <li 
                            onClick={() => setActiveTab("estadisticas")} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", margin: "10px 0" }}
                        >
                            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: "10px" }} />
                            Estadísticas
                        </li>
                        <li 
                            onClick={() => setActiveTab("reseñas")} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", margin: "10px 0" }}
                        >
                            <FontAwesomeIcon icon={faStar} style={{ marginRight: "10px" }} />
                            Reseñas
                        </li>
                        <li 
                            onClick={() => setActiveTab("historial")} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", margin: "10px 0" }}
                        >
                            <FontAwesomeIcon icon={faHistory} style={{ marginRight: "10px" }} />
                            Historial
                        </li>
                        <li 
                            onClick={() => setActiveTab("eliminar")} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", margin: "10px 0", color: "red" }}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "10px" }} />
                            Eliminar cuenta
                        </li>
                    </ul>
                </nav>
            </div>
            <div style={{ marginLeft: "270px", padding: "20px" }}>
                {renderComponent()}
            </div>
        </div>
    );
}

export default MyAccount;
