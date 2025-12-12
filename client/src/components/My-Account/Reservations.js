import React from "react";

// Paleta de colores ajustada al tema de RentUp
const theme = {
    primaryColor: '#6366f1',
    accentColor: '#10b981', // Verde para éxito/actividad
    lightGray: '#f3f4f6',
    textDark: '#1f2937',
    textMuted: '#6b7280',
};

// Estilos para el componente de Facturación
const styles = {
    // Estilo para el subtítulo "Facturación"
    subHeading: {
        fontSize: '1.25rem', 
        fontWeight: '600',
        color: theme.textDark,
        marginTop: '0',
        marginBottom: '0.5rem',
    },
    // Estilo para la descripción
    description: {
        color: theme.textMuted,
        marginBottom: '2rem',
        fontSize: '0.95rem',
    },
    // Contenedor principal para las tarjetas (usamos Flexbox o Grid)
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Hace que las tarjetas se ajusten
        gap: '1.5rem',
    },
    card: {
        padding: "1.5rem",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: theme.textDark,
        marginBottom: '1rem',
        borderBottom: `1px solid ${theme.lightGray}`,
        paddingBottom: '0.5rem',
    },
    icon: {
        marginRight: '0.5rem',
        color: theme.primaryColor,
    },
    buttonPrimary: {
        backgroundColor: theme.primaryColor,
        color: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.3s',
        marginTop: '1rem',
    },
    paymentDetail: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: `1px dashed ${theme.lightGray}`,
    },
    noContent: {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: theme.lightGray,
        borderRadius: '8px',
        color: theme.textMuted,
        marginTop: '1.5rem',
    }
};

function Reservations() {
    return (
        <div>
            {/* Encabezado de la Sección (Siguiendo el estilo de RentUp) */}
            <h3 style={styles.subHeading}>Facturación y Pagos</h3>
            <p style={styles.description}>Aquí puedes gestionar tus métodos de pago, ver tu historial de transacciones y actualizar tu información fiscal.</p>

            <div style={styles.cardGrid}>
                
                {/* 💳 Tarjeta 1: Método de Pago Principal */}
                <div style={styles.card}>
                    <h4 style={styles.cardTitle}>
                        <span style={styles.icon}>💳</span> Método de Pago
                    </h4>
                    
                    <div style={styles.paymentDetail}>
                        <span>VISA - **** 4567</span>
                        <span style={{ color: theme.accentColor, fontWeight: '600' }}>Principal</span>
                    </div>
                    <div style={styles.paymentDetail}>
                        <span>Expira: 12/26</span>
                    </div>

                    <button style={styles.buttonPrimary}>
                        Actualizar Método
                    </button>
                </div>

                {/* 📄 Tarjeta 2: Historial de Transacciones */}
                <div style={styles.card}>
                    <h4 style={styles.cardTitle}>
                        <span style={styles.icon}>🧾</span> Transacciones Recientes
                    </h4>
                    
                    {/* Simulación de una lista de transacciones */}
                    <p style={{ ...styles.paymentDetail, color: theme.textDark }}>
                        <span>Alquiler Apartamento X</span>
                        <span style={{ fontWeight: '700' }}>$450.00</span>
                    </p>
                    <p style={{ ...styles.paymentDetail, color: theme.textDark }}>
                        <span>Servicio de Limpieza</span>
                        <span style={{ fontWeight: '700' }}>$25.00</span>
                    </p>
                    
                    <button style={styles.buttonPrimary}>
                        Ver Historial Completo
                    </button>
                </div>

                {/* 📝 Tarjeta 3: Información Fiscal / IVA (Si la pantalla es lo suficientemente ancha) */}
                 <div style={styles.card}>
                    <h4 style={styles.cardTitle}>
                        <span style={styles.icon}>📝</span> Información Fiscal
                    </h4>
                    
                    <div style={styles.noContent}>
                        <p style={{ margin: 0 }}>Aún no has proporcionado información fiscal. Es requerida para ciertos pagos.</p>
                    </div>

                    <button style={{ ...styles.buttonPrimary, backgroundColor: theme.textMuted }}>
                        Añadir Datos Fiscales
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Reservations;