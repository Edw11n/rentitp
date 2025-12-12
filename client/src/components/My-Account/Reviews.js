import React, { useEffect, useState } from "react";
import { fetchTopLandlord } from "../../apis/statsController";

// Paleta de colores ajustada al tema de RentUp
const theme = {
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    lightGray: '#f3f4f6', // Gris muy claro para fondos de ayuda
    textDark: '#1f2937',
    textMuted: '#6b7280',
};

// Estilos del componente
const styles = {
    // Estilo para el encabezado de la sección (Facturación)
    subHeading: {
        fontSize: '1.25rem', // Hacer el título "Facturación" un poco más grande
        fontWeight: '600',
        color: theme.textDark,
        marginTop: '0',
        marginBottom: '0.5rem',
    },
    // Estilo para el texto de descripción
    description: {
        color: theme.textMuted,
        marginBottom: '2rem',
        fontSize: '0.95rem',
    },
    // Estilos de la tarjeta "Arrendador Destacado"
    card: {
        padding: "1.5rem",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
    },
    titleContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
        paddingBottom: "1rem",
        borderBottom: `1px solid ${theme.lightGray}`, // Separador sutil
    },
    icon: {
        fontSize: "1.5rem",
        marginRight: "0.75rem",
        color: theme.secondaryColor,
    },
    heading: {
        margin: 0,
        color: theme.textDark,
        fontSize: "1.1rem",
        fontWeight: "600",
    },
    dataList: {
        display: 'grid',
        gap: '0.75rem',
        marginTop: '1rem',
    },
    dataItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: "0.95rem",
    },
    dataLabel: {
        fontWeight: "500",
        color: theme.textMuted,
    },
    dataValue: {
        fontWeight: "600",
        color: theme.textDark,
        textAlign: 'right',
    },
    ctaMessage: {
        marginTop: "1.5rem",
        padding: "1rem",
        backgroundColor: theme.lightGray,
        color: theme.textMuted,
        borderRadius: "6px",
        textAlign: "center",
        fontWeight: "500",
        border: `1px solid ${theme.lightGray}`,
    },
    loadingMessage: {
        color: theme.textMuted,
        fontStyle: "italic",
    },
    // El texto de error en rojo se ajusta al estilo de la imagen
    errorMessage: {
        color: '#ef4444', 
        padding: '0.5rem 0',
        fontWeight: '500',
    }
};

function Reviews() {
    const [topLandlord, setTopLandlord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTopLandlord = async () => {
            try {
                const data = await fetchTopLandlord();
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
            {/* Título "Facturación" y descripción (ajustado para que sea Sub-título) */}
            <h3 style={styles.subHeading}>Facturación</h3>
            <p style={styles.description}>Aquí puedes gestionar tu información de facturación.</p>

            {/* Componente "Arrendador Destacado" */}
            <div style={styles.card}>
                <div style={styles.titleContainer}>
                    <span style={styles.icon}>🏆</span>
                    <h4 style={styles.heading}>Arrendador destacado</h4>
                </div>

                {loading ? (
                    <p style={styles.loadingMessage}>Cargando datos...</p>
                ) : topLandlord ? (
                    <div>
                        {/* Datos del Arrendador Destacado */}
                        <div style={styles.dataList}>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Nombre:</span>
                                <span style={styles.dataValue}>{topLandlord?.nombre_completo || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Correo:</span>
                                <span style={styles.dataValue}>{topLandlord?.correo || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Apartamentos publicados:</span>
                                <span style={styles.dataValue}>{topLandlord?.total_apartamentos_publicados || 0}</span>
                            </div>
                        </div>
                        
                        {/* Mensaje de motivación */}
                        <div style={styles.ctaMessage}>
                            ¡Inspírate y publica más apartamentos para alcanzar esta meta! 🚀
                        </div>
                    </div>
                ) : (
                    // Estado sin información (como en las capturas)
                    <p style={styles.errorMessage}>No se encontró información del arrendador destacado.</p>
                )}
            </div>
        </div>
    );
}

export default Reviews;