import React, { useState, useEffect } from "react";
import ApartmentListController from "../apis/apartmentlistController";
import ImageModal from "./ImageModal";
import ChatComponent from "./ChatComponent";
import { 
  FaMapMarkerAlt, 
  FaImages, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaComments,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
  FaExpand
} from "react-icons/fa";

function ApartmentList({ searchTerm = "" }) {
  const [controller] = useState(new ApartmentListController());
  const [loading, setLoading] = useState(true);
  const [apartmentList, setApartmentList] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [selectedLessor, setSelectedLessor] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});

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

  const handleMapCenter = (lat, lng) => {
    if (lat && lng) {
      localStorage.setItem("mapCenter", JSON.stringify([lat, lng]));
      window.dispatchEvent(new Event("storage"));
    }
  };

  // Auto-avanzar carrusel para todos los apartamentos
  useEffect(() => {
    const intervals = filteredApartments.map((apartment) => {
      if (apartment?.images) {
        const imageArray = typeof apartment.images === 'string' 
          ? apartment.images.split(",") 
          : apartment.images;
        
        if (imageArray.length > 1) {
          return setInterval(() => {
            setCarouselIndexes((prev) => ({
              ...prev,
              [apartment.id_apt]: ((prev[apartment.id_apt] || 0) + 1) % imageArray.length
            }));
          }, 3000);
        }
      }
      return null;
    }).filter(Boolean);

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [apartmentList]);

  const handleCarouselPrev = (aptId, imagesLength) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) - 1 + imagesLength) % imagesLength
    }));
  };

  const handleCarouselNext = (aptId, imagesLength) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) + 1) % imagesLength
    }));
  };

  const openImageModal = (images, currentIndex = 0) => {

    if (!images || images.length === 0) return;
    const imageArray = typeof images === 'string' ? images.split(",") : images;
    setModalImages(imageArray);
    setCurrentImageIndex(currentIndex);
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

  // Filtrar apartamentos según búsqueda
  const filteredApartments = apartmentList.filter((apt) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      apt.barrio?.toLowerCase().includes(searchLower) ||
      apt.direccion_apt?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="h-full">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-gray-500 font-medium">Cargando apartamentos...</p>
        </div>
      ) : filteredApartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <FaHome className="text-6xl text-gray-300" />
          <p className="text-gray-500 font-medium">
            {searchTerm ? "No se encontraron apartamentos" : "No hay apartamentos disponibles"}
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-400">Intenta con otro término de búsqueda</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApartments.map((apartment) => {
            const imageArray = apartment.images 
              ? (typeof apartment.images === 'string' ? apartment.images.split(",") : apartment.images)
              : [];
            const currentIndex = carouselIndexes[apartment.id_apt] || 0;

            return (
              <div
                key={apartment.id_apt || apartment.user_id}
                className="bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 hover:border-indigo-300"
              >
                <div className="flex gap-6 p-4">
                  {/* Carrusel de imágenes - Lado izquierdo */}
                  {imageArray.length > 0 ? (
                    <div className="w-72 h-72 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md bg-gray-900 group">
                      <img
                        src={imageArray[currentIndex]}
                        alt={`Apartamento ${currentIndex + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleMapCenter(apartment.latitud_apt, apartment.longitud_apt)}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Overlay de gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                      
                      {/* Botón expandir */}
                      <button
                        onClick={() => openImageModal(apartment.images, currentIndex)}
                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        title="Ver en pantalla completa"
                      >
                        <FaExpand className="text-gray-700 text-sm" />
                      </button>

                      {/* Controles de navegación */}
                      {imageArray.length > 1 && (
                        <>
                          <button
                            onClick={() => handleCarouselPrev(apartment.id_apt, imageArray.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <FaChevronLeft className="text-gray-700 text-sm" />
                          </button>
                          <button
                            onClick={() => handleCarouselNext(apartment.id_apt, imageArray.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <FaChevronRight className="text-gray-700 text-sm" />
                          </button>
                        </>
                      )}

                      {/* Indicadores de posición */}
                      {imageArray.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {imageArray.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCarouselIndexes((prev) => ({ ...prev, [apartment.id_apt]: idx }))}
                              className={`h-2 rounded-full transition-all ${
                                idx === currentIndex
                                  ? 'w-8 bg-white'
                                  : 'w-2 bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Contador */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {currentIndex + 1} / {imageArray.length}
                      </div>
                    </div>
                  ) : (
                    <div className="w-72 h-72 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaHome className="text-gray-400 text-6xl" />
                    </div>
                  )}

                  {/* Información del apartamento - Lado derecho */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleMapCenter(apartment.latitud_apt, apartment.longitud_apt)}
                        >
                          <h3 className="font-bold text-xl text-gray-800 hover:text-indigo-600 transition-colors">
                            {apartment.barrio}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 text-base">
                            <FaMapMarkerAlt className="text-sm" />
                            <span>{apartment.direccion_apt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Descripción */}
                      {apartment.info_add_apt && (
                        <div className="mb-4">
                          <p className="text-gray-600 text-base line-clamp-3">
                            {apartment.info_add_apt}
                          </p>
                        </div>
                      )}

                      {/* Información del arrendador */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <FaUser className="text-indigo-500 text-sm" />
                          <p className="font-semibold text-gray-700 text-base">Arrendador</p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium">
                              {apartment.user_name} {apartment.user_lastname}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaEnvelope className="text-gray-400" />
                            <span>{apartment.user_email}</span>
                          </div>
                          {apartment.user_phonenumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaPhone className="text-gray-400" />
                              <span>{apartment.user_phonenumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botón de chat */}
                    <button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-base font-medium"
                      onClick={() => openChat(apartment.user_id)}
                    >
                      <FaComments className="text-lg" />
                      <span>Chatear con el arrendador</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaComments className="text-white" />
                </div>
                <h3 className="text-white font-semibold">Chat con arrendador</h3>
              </div>
              <button
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                onClick={closeChat}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ChatComponent emisor_id={emisor_id} receptor_id={selectedLessor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApartmentList;
