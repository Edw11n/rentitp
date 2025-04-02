import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileInvoiceDollar, faStar, faHistory, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import User from '../components/My-Account/User';


function MyAccount() {
    return (
        <div style={{ display: "flex"}}>
            <div style={{ display: "flex" }}>
                <nav style={{ width: "250px", background: "#f4f4f4", padding: "10px" }}>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
                            Mis datos
                        </li>
                        <li style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: "10px" }} />
                            Facturación
                        </li>
                        <li style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <FontAwesomeIcon icon={faStar} style={{ marginRight: "10px" }} />
                            Mis reseñas
                        </li>
                        <li style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <FontAwesomeIcon icon={faHistory} style={{ marginRight: "10px" }} />
                            Historial
                        </li>
                        <li style={{ display: "flex", alignItems: "center", margin: "10px 0", color: "red" }}>
                            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "10px" }} />
                            Eliminar cuenta
                        </li>
                    </ul>
                </nav>
            </div>
            <div style={{ marginLeft: "270px", padding: "20px" }}>
                <User/>
            </div>
        </div>
    );
}

export default MyAccount;
