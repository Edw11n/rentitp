import React, {useContext, useState} from "react";
import { UserContext } from "../../contexts/UserContext";
import {updateUserData, fetchUserData} from "../../apis/myAccountController";

function User() {
    const { user, login } = useContext(UserContext);
    const { nombre, apellido, email, telefono, rol, token } = user;
    const defaultRol = rol === 'Arrendador' ? 'Arrendador' : 'Usuario';
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
        <div className="bg-white p-4 rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800">Mis datos</h3>
                        <p className="text-sm text-gray-600">Actualiza tu información personal</p>
                    </div>
                </div>

                <form onSubmit={createNewUserData} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role selector */}
                    <div className="flex flex-col">
                        <label htmlFor="rol" className="text-sm font-medium text-gray-700 mb-1">Tipo de usuario</label>
                        <select
                            id="rol"
                            name="rol"
                            value={formData.rol}
                            onChange={e => {
                                // Convertir a número si viene como string
                                const val = e.target.value;
                                handleChange({ target: { name: 'rol', value: isNaN(Number(val)) ? val : Number(val) } });
                            }}
                            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={1}>Usuario</option>
                            <option value={2}>Arrendador</option>
                        </select>
                    </div>

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Apellido */}
                    <div className="flex flex-col">
                        <label htmlFor="apellido" className="text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            required
                            value={formData.apellido}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col">
                        <label htmlFor="telefono" className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="phone"
                            id="telefono"
                            name="telefono"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ nombre, apellido, email, telefono, rol, password: '' })}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default User;