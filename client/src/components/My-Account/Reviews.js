import React, { useEffect, useState } from "react";
import { fetchTopLandlord } from "../../apis/statsController";

function Reviews() {
    const [topLandlord, setTopLandlord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTopLandlord = async () => {
            try {
                const data = await fetchTopLandlord();
                // Si el array está vacío, setTopLandlord a null
                setTopLandlord(data && data.length > 0 ? data[0] : null);
            } catch (error) {
                console.error("Error al cargar el top arrendador", error);
                setTopLandlord(null);
            } finally {
                setLoading(false);
            }
        };

        getTopLandlord();
    }, []);

    return (
        <div>
            <h2>Facturación</h2>
            <p>Aquí puedes gestionar tu información de facturación.</p>

            {/* Apartado de la "Meta" */}
            <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h3>🏆 Arrendador destacado</h3>
                {loading ? (
                    <p>Cargando datos...</p>
                ) : topLandlord ? (
                    <div>
                        <p><strong>Nombre:</strong> {topLandlord?.nombre_completo || 'No disponible'}</p>
                        <p><strong>Correo:</strong> {topLandlord?.correo || 'No disponible'}</p>
                        <p><strong>Total de apartamentos publicados:</strong> {topLandlord?.total_apartamentos_publicados || 0}</p>
                        <p style={{ color: "green" }}>¡Inspírate y publica más apartamentos para alcanzar esta meta! 🚀</p>
                    </div>
                ) : (
                    <p>No se encontró información del arrendador destacado.</p>
                )}
            </div>
        </div>
    );
}

export default Reviews;
