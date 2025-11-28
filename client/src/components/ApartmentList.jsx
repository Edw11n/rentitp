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

  const showRouteToITP = (lat, lng) => {
    localStorage.setItem("showRoute", JSON.stringify({ lat, lng }));
    window.dispatchEvent(new Event("storage"));
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

                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    onClick={() => showRouteToITP(apartment.latitud_apt, apartment.longitud_apt)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Ver Ruta al ITP
                  </button>
                  
                  <button
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    onClick={() => openChat(apartment.user_id)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chatear
                  </button>
                </div>
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
