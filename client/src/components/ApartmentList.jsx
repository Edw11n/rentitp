import React, { useState, useEffect } from "react";
import ApartmentListController from "../apis/apartmentlistController";
import ImageModal from "./ImageModal";
import ChatComponent from "./ChatComponent";

function ApartmentList() {
  const [controller] = useState(new ApartmentListController());
  const [loading, setLoading] = useState(true);
  const [apartmentList, setApartmentList] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [selectedLessor, setSelectedLessor] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const emisor_id = currentUser?.id;

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
      window.dispatchEvent(new Event("storage"));
    }
  };

  const openImageModal = (images) => {
    if (!images || images.length === 0) return;
    setModalImages(images.split ? images.split(",") : images);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev === 0 ? modalImages.length - 1 : prev - 1)
    );

  const handleNextImage = () =>
    setCurrentImageIndex(
      (prev) => (prev === modalImages.length - 1 ? 0 : prev + 1)
    );

  const openChat = (lessorId) => {
    setSelectedLessor(lessorId);
    setShowChat(true);
  };

  const closeChat = () => {
    setShowChat(false);
    setSelectedLessor(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      {loading ? (
        <p className="text-center text-gray-500 mt-4">Cargando apartamentos...</p>
      ) : apartmentList.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No hay apartamentos disponibles</p>
      ) : (
        apartmentList.map((apartment) => (
          <div
            key={apartment.id_apt || apartment.user_id}
            className={`border rounded-lg p-4 mb-4 transition-all ${
              selectedApartment === apartment.id_apt
                ? "bg-indigo-50 shadow-lg"
                : "hover:bg-gray-50"
            }`}
          >
            <div>
              <h3
                className="font-semibold text-lg cursor-pointer"
                onClick={() =>
                  toggleApartmentDetails(
                    apartment.id_apt,
                    apartment.latitud_apt,
                    apartment.longitud_apt
                  )
                }
              >
                {apartment.barrio}
              </h3>
              <p
                className="text-gray-600 cursor-pointer"
                onClick={() =>
                  toggleApartmentDetails(
                    apartment.id_apt,
                    apartment.latitud_apt,
                    apartment.longitud_apt
                  )
                }
              >
                {apartment.direccion_apt}
              </p>
            </div>

            {selectedApartment === apartment.id_apt && (
              <div className="mt-3 space-y-2">
                <p className="font-medium">Detalles del apartamento:</p>
                <p>Información adicional: {apartment.info_add_apt}</p>

                {apartment.images && apartment.images.length > 0 && (
                  <p
                    className="text-indigo-600 cursor-pointer italic"
                    onClick={() => openImageModal(apartment.images)}
                  >
                    Ver imágenes
                  </p>
                )}

                <div className="mt-2">
                  <p className="font-medium">Información del arrendador:</p>
                  <p>
                    {apartment.user_name} {apartment.user_lastname}
                  </p>
                  <p>Email: {apartment.user_email}</p>
                  <p>Teléfono: {apartment.user_phonenumber}</p>
                </div>

                <button
                  className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                  onClick={() => openChat(apartment.user_id)}
                >
                  💬 Chatear con el arrendador
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Modal de imágenes */}
      {showModal && (
        <ImageModal
          images={modalImages}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}

      {/* Modal de chat */}
      {showChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-4 rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeChat}
            >
              ✖
            </button>
            <ChatComponent emisor_id={emisor_id} receptor_id={selectedLessor} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ApartmentList;
