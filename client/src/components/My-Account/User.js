import React, {useContext, useState} from "react";
import Select from 'react-select';
import { UserContext } from "../../contexts/UserContext";
import {updateUserData, fetchUserData} from "../../apis/myAccountController";

function User() {
    const { user, login } = useContext(UserContext);
    const { nombre, apellido, email, telefono, rol, token } = user;
    const defaultRol = rol === 'Arrendador' ? 'Arrendador' : 'Usuario';
    const options = [
        { value: 1, label: 'Usuario' },
        { value: 2, label: 'Arrendador' }
    ];
    const [formData, setFormData] = useState({
        nombre: nombre || '',
        apellido: apellido || '',
        email: email || '',
        telefono: telefono || '',
        rol: rol || defaultRol,
        password: ''
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleRoleChange = (selectedOption) => {
        setFormData({
            ...formData,
            rol: selectedOption.value
        });
    }
    const createNewUserData = async (e) => {
        e.preventDefault();
        if (!token) {
            alert("El usuario no ha iniciado sesión.");
            return;
        }
        console.log(formData);
        const updatedData = await updateUserData( token, formData);
        if (updatedData) {
            const freshUserData = await fetchUserData(token);
            if (freshUserData) {
                login({
                    id: freshUserData.user_id,
                    nombre: freshUserData.user_name,
                    apellido: freshUserData.user_lastname,
                    email: freshUserData.user_email,
                    telefono: freshUserData.user_phonenumber,
                    rol: freshUserData.rol_id,
                    token: token
                })
                setFormData({
                    nombre: freshUserData.user_name,
                    apellido: freshUserData.user_lastname,
                    email: freshUserData.user_email,
                    telefono: freshUserData.user_phonenumber,
                    rol: freshUserData.rol_id,
                    password: ''
                });
                alert("Datos actualizados correctamente.");
            } else {
                alert("Error al obtener los datos actualizados.");
            }
        } else {
            alert("Error al actualizar los datos.");
        }
    }
    return(
        <div>
            <h3>Mis datos</h3>
            <form onSubmit={createNewUserData}>
                <div className="form-group">
                    <Select 
                        options={options} 
                        name="rol"
                        value={options.find(option => option.value === formData.rol)}
                        onChange={handleRoleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        required 
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="apellido">Apellido:</label>
                    <input 
                        type="text" 
                        id="apellido" 
                        name="apellido" 
                        required value={formData.apellido}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input 
                        type="phone" 
                        id="telefono" 
                        name="telefono" 
                        required 
                        value={formData.telefono}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"  
                        value={formData.password}
                        onChange={handleChange}/>
                </div>
                <button type="submit">Actualizar</button>
            </form>
        </div>
    )
}
export default User;