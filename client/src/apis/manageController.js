import { useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../contexts/UserContext";
const API_URL = process.env.REACT_APP_API_URL;

const useManageController = () => {
    const [loading, setLoading] = useState(true);
    const [apartmentList, setApartmentList] = useState([]);
    const { user } = useContext(UserContext);
    const [editApartmentId, setEditApartmentId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        direccion_apt: "",
        barrio: "",
        latitud_apt: "",
        longitud_apt: "",
        info_add_apt: "",
        images: []
    });

    const fetchApartments = () => {
        if (!user || !user.id) {
            alert("El usuario no ha iniciado sesión.");
            return;
        }
        setLoading(true);
        Axios.get(`${API_URL}/apartments/manage`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) => {
            setApartmentList(response.data);
        })
        .catch((error) => {
            console.error("Error cargando apartamentos:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleEditClick = (apartment) => {
        console.log("Tipo de apartment.images:", typeof apartment.images, apartment.images);
        
        setEditApartmentId(apartment.id_apt);
        setEditFormData({
            direccion_apt: apartment.direccion_apt,
            barrio: apartment.barrio,
            latitud_apt: apartment.latitud_apt,
            longitud_apt: apartment.longitud_apt,
            info_add_apt: apartment.info_add_apt,
            images: Array.isArray(apartment.images) ? apartment.images : [] 
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleDelete = (id_apt) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este apartamento?")) {
            Axios.delete(`${API_URL}/apartments/delete/${id_apt}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })
            .then(() => {
                alert("Apartamento eliminado exitosamente");
                setApartmentList((prevList) =>
                    prevList.filter((apartment) => apartment.id_apt !== id_apt)
                );
            })
            .catch((error) => {
                console.error("Error eliminando apartamento:", error);
                alert("Hubo un problema al eliminar el apartamento");
            });
        }
    };

    const handleUpdate = (id_apt, newImageFiles = []) => {
        let missingFields = [];
        if (!editFormData.direccion_apt) missingFields.push("Dirección");
        if (!editFormData.barrio) missingFields.push("Barrio");
        if (!editFormData.latitud_apt) missingFields.push("Latitud");
        if (!editFormData.longitud_apt) missingFields.push("Longitud");
        if (!editFormData.info_add_apt) missingFields.push("Información adicional");

        if (missingFields.length > 0) {
            alert(`Por favor rellena los siguientes campos: ${missingFields.join(", ")}`);
            return;
        }

        console.log("Nuevas imágenes a enviar:", newImageFiles);

        const existingImages = Array.isArray(editFormData.images)
            ? editFormData.images
            : [];
        
        console.log("Imágenes existentes normalizadas que se enviarán:", existingImages);

        const formData = new FormData();
        formData.append("direccion_apt", editFormData.direccion_apt);
        formData.append("barrio", editFormData.barrio);
        formData.append("latitud_apt", editFormData.latitud_apt);
        formData.append("longitud_apt", editFormData.longitud_apt);
        formData.append("info_add_apt", editFormData.info_add_apt);
        formData.append("existing_images", JSON.stringify(existingImages));
        
        newImageFiles.forEach((file) => {
            formData.append("new_images", file);
        });

        Axios.put(`${API_URL}/apartments/update/${id_apt}`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data", 
                "Authorization": `Bearer ${user.token}`
            },
        })
        .then(() => {
            alert("Apartamento actualizado exitosamente");
            fetchApartments();
            setEditApartmentId(null);
        })
        .catch((error) => {
            console.error("Error actualizando apartamento:", error);
            alert("Hubo un problema al actualizar el apartamento");
        });
    };

    const handleCancelEdit = () => {
        setEditApartmentId(null);
    };

    return {
        loading,
        apartmentList,
        fetchApartments,
        editApartmentId,
        setEditApartmentId,
        editFormData,
        handleEditClick,
        handleInputChange,
        handleDelete,
        handleUpdate,
        handleCancelEdit,
    };
};

export default useManageController;