import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import './styles/Manage.css';

function Manage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apartmentList, setApartmentList] = useState([]);
  const { user } = useContext(UserContext);
  const [editApartmentId, setEditApartmentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    direccion_apartamento: "",
    barrio_apartamento: "",
    latitud_apartamento: "",
    longitud_apartamento: "",
    info_adicional_apartamento: "",
  });

  useEffect(() => {
    if (user && user.email) {
      fetchApartments();
    } else {
      alert("Debes iniciar sesión para ver tus apartamentos.");
      setLoading(false);
      navigate('/');
    }
  }, [user]);

  const fetchApartments = () => {
    setLoading(true);
    Axios.get(`http://localhost:3001/manage?email=${user.email}`)
      .then((response) => {
        setApartmentList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error cargando apartamentos:', error);
        setLoading(false);
      });
  };

  const handleEditClick = (apartment) => {
    setEditApartmentId(apartment.id_apartamento);
    setEditFormData({
      direccion_apartamento: apartment.direccion_apartamento,
      barrio_apartamento: apartment.barrio_apartamento,
      latitud_apartamento: apartment.latitud_apartamento,
      longitud_apartamento: apartment.longitud_apartamento,
      info_adicional_apartamento: apartment.info_adicional_apartamento,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDelete = (id_apartamento) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este apartamento?")) {
      Axios.delete(`http://localhost:3001/delete/${id_apartamento}`)
        .then(() => {
          alert("Apartamento eliminado exitosamente");
          setApartmentList(apartmentList.filter(apartment => apartment.id_apartamento !== id_apartamento));
        })
        .catch((error) => {
          console.error('Error eliminando apartamento:', error);
          alert('Hubo un problema al eliminar el apartamento');
        });
    }
  };

  const handleUpdate = (id_apartamento) => {
    if (!editFormData.direccion_apartamento || !editFormData.barrio_apartamento || 
        !editFormData.latitud_apartamento || !editFormData.longitud_apartamento || 
        !editFormData.info_adicional_apartamento) {
      alert('Por favor rellena los campos');
      return;
    }
    
    Axios.put(`http://localhost:3001/update/${id_apartamento}`, editFormData)
      .then(() => {
        alert("Apartamento actualizado exitosamente");
        setApartmentList(apartmentList.map(apartment => 
          apartment.id_apartamento === id_apartamento ? { ...apartment, ...editFormData } : apartment
        ));
      })
      .catch((error) => {
        console.error('Error actualizando apartamento:', error);
        alert('Hubo un problema al actualizar el apartamento');
      });

    setEditApartmentId(null); // Finaliza la edición
  };

  const handleCancelEdit = () => {
    setEditApartmentId(null); // Finaliza la edición sin guardar cambios
  };

  return (
    <div className="manage-container">
      {loading ? (
        <p>Cargando apartamentos...</p>
      ) : (
        <div>
          <h2>Mis Apartamentos</h2>
          <button className="refresh-btn" onClick={fetchApartments}>Actualizar</button>
          {apartmentList.length === 0 ? (
            <p>No hay apartamentos disponibles para editar.</p>
          ) : (
            <div className="apartment-list">
              {apartmentList.map((apartment) => (
                <div key={apartment.id_apartamento} className="apartment-item">
                  {editApartmentId === apartment.id_apartamento ? (
                    <div className="edit-apartment-form">
                      <input 
                        type="text" 
                        name="barrio_apartamento" 
                        value={editFormData.barrio_apartamento} 
                        onChange={handleInputChange} 
                        placeholder="Barrio" 
                      />
                      <input 
                        type="text" 
                        name="direccion_apartamento" 
                        value={editFormData.direccion_apartamento} 
                        onChange={handleInputChange} 
                        placeholder="Dirección" 
                      /> 
                      <input 
                        type="text" 
                        name="latitud_apartamento" 
                        value={editFormData.latitud_apartamento} 
                        onChange={handleInputChange} 
                        placeholder="Latitud" 
                      />
                      <input 
                        type="text" 
                        name="longitud_apartamento" 
                        value={editFormData.longitud_apartamento} 
                        onChange={handleInputChange} 
                        placeholder="Longitud" 
                      />
                      <textarea 
                        className="edit-form-textarea" 
                        name="info_adicional_apartamento" 
                        value={editFormData.info_adicional_apartamento} 
                        onChange={handleInputChange} 
                        placeholder="Información adicional"
                      />
                      <div className="edit-buttons"> 
                        <button className="update-btn" onClick={() => handleUpdate(apartment.id_apartamento)}>Actualizar</button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="apartment-details">
                        <p><strong>Barrio:</strong> {apartment.barrio_apartamento}</p>
                        <p><strong>Dirección:</strong> {apartment.direccion_apartamento}</p>
                        <p><strong>Latitud:</strong> {apartment.latitud_apartamento}</p>
                        <p><strong>Longitud:</strong> {apartment.longitud_apartamento}</p>
                        <p><strong>Información adicional:</strong> {apartment.info_adicional_apartamento}</p>
                      </div>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEditClick(apartment)}>Editar</button>
                        <button className="delete-btn" onClick={() => handleDelete(apartment.id_apartamento)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Manage;
