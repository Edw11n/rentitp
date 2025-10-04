import React, { useState, useEffect } from "react";
import ApartmentListController from "../apis/apartmentlistController";
import ImageModal from "./ImageModal";
import "../styles/apartments.css";

function ApartmentList() {
    const [controller] = useState(new ApartmentListController());
    const [loading, setLoading] = useState(true);
    const [apartmentList, setApartmentList] = useState([]);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                await controller.fetchApartments();
                setApartmentList(controller.apartmentList);
                setLoading(controller.loading);
            } catch (error) {
                console.error(error.message);
                setLoading(false);
            }
        };
        fetchApartments();
    }, [controller]);

    const toggleApartmentDetails = (id, lat, lng) => {
        setSelectedApartment(selectedApartment === id ? null : id);

        if (lat && lng) {
            localStorage.setItem("mapCenter", JSON.stringify([lat, lng]));
            window.dispatchEvent(new Event("storage")); // Disparar evento para actualizar el mapa
        }
    };

    const openImageModal = (images) => {
        if (images && images.length > 0) {
            setModalImages(images);
            setCurrentImageIndex(0);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalImages([]);
        setCurrentImageIndex(0);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? modalImages.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === modalImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="apartment-list-container">
            {loading ? (
                <p className="loading-text">Cargando apartamentos...</p>
            ) : apartmentList.length > 0 ? (
                apartmentList.map((apartment) => (
                    <div
                        key={apartment.id_apt || apartment.user_id}
                        className={`apartment-item-map ${
                            selectedApartment === apartment.id_apt ? "selected" : ""
                        }`}
                    >
                        <div className="apartment-info">
                            <h3
                                className="apartment-title"
                                onClick={() =>
                                    toggleApartmentDetails(apartment.id_apt, apartment.latitud_apt, apartment.longitud_apt)
                                }
                            >
                                {apartment.barrio}
                            </h3>
                            <p
                                className="apartment-address"
                                onClick={() =>
                                    toggleApartmentDetails(apartment.id_apt, apartment.latitud_apt, apartment.longitud_apt)
                                }
                            >
                                {apartment.direccion_apt}
                            </p>
                        </div>

                        {selectedApartment === apartment.id_apt && (
                            <div className="apartment-details">
                                <p className="details-header">Detalles del apartamento:</p>
                                <p>Información adicional: {apartment.info_add_apt}</p>
                                {apartment.images && apartment.images.length > 0 && (
                                    <p
                                        className="view-images"
                                        onClick={() =>
                                            openImageModal(
                                                apartment.images.split
                                                    ? apartment.images.split(",")
                                                    : apartment.images
                                            )
                                        }
                                        style={{ cursor: "pointer", fontStyle: "italic" }}
                                    >
                                        Ver imágenes
                                    </p>
                                )}
                                <p className="lessor-info-header">
                                    <b>Información del arrendador</b>
                                </p>
                                <p>
                                    Arrendador: {apartment.user_name} {apartment.user_lastname}
                                </p>
                                <p>Email: {apartment.user_email}</p>
                                <p>Teléfono: {apartment.user_phonenumber}</p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="empty-list-message">No hay apartamentos disponibles</p>
            )}

            {showModal && (
                <ImageModal
                    images={modalImages}
                    currentIndex={currentImageIndex}
                    onClose={closeModal}
                    onPrev={handlePrevImage}
                    onNext={handleNextImage}
                />
            )}
        </div>
    );
}

export default ApartmentList;
