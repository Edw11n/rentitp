import React, { useEffect, useState } from 'react';
import { fetchUserStats } from '../../apis/statsController'; // Ajusta la ruta según tu estructura

const Record = () => {
    const [stats, setStats] = useState(null); // Cambia de array a null, ya que es un solo objeto
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                if (!token) {
                    console.error('Token no encontrado');
                    return;
                }
                const data = await fetchUserStats(token);
                console.log('Stats obtenidos:', data); // Verifica que los datos sean correctos

                // Verifica que los datos sean un objeto y no un array
                if (data && typeof data === 'object') {
                    setStats(data);
                } else {
                    console.error('No se recibieron datos válidos', data);
                    setStats(null); // Si no hay datos válidos, se mantiene null
                }
            } catch (error) {
                console.error('Error cargando stats', error);
            } finally {
                setLoading(false);
            }
        };

        getStats();
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h2>Tu apartamento más arrendado 📊</h2>
            {stats ? (
                <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                    <h3>Apartamento</h3>
                    <p><strong>Arrendador:</strong> {stats.arrendador_nombre} {stats.arrendador_apellido}</p>
                    <p><strong>Dirección:</strong> {stats.direccion_apt}</p>
                    <p><strong>Barrio:</strong> {stats.barrio}</p>
                    <p><strong>Meses arrendado:</strong> {stats.meses_arrendado}</p>
                    <p><strong>Inicio del arrendamiento:</strong> {stats.inicio_arrendamiento}</p>
                    <p><strong>Fin del arrendamiento:</strong> {stats.fin_arrendamiento}</p>
                    <p><strong>Inquilino:</strong> {stats.inquilino_nombre} {stats.inquilino_apellido}</p>
                    <p><strong>Email Inquilino:</strong> {stats.inquilino_email}</p>
                </div>
            ) : (
                <p>No hay datos todavía.</p>
            )}
        </div>
    );
};

export default Record;
