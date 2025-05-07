const Stats = require('../models/statsModel'); // Asegúrate de que la ruta sea correcta

const getUserTopApartment = async (req, res) => {
    const userId = req.user.id; // Esto viene del token decodificado
    console.log("userId", userId); // Verifica que el userId esté definido y sea correcto

    try {
        const stats = await Stats.getStats(userId);

        if (!stats || stats.length === 0) {
            // Si no se encuentran datos, envía un mensaje claro.
            return res.status(404).json({ message: "Este usuario no ha arrendado apartamentos." });
        }

        res.json(stats[0]); // Devuelve los datos si los encuentra
    } catch (error) {
        console.error('Error al obtener las estadísticas:', error); 
        res.status(500).json({ message: "Error al obtener las estadísticas.", error: error.message });
    }
};

module.exports = { getUserTopApartment };
