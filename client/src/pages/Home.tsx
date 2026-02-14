import { MessageCircle, Clock, MapPin, Star, Truck, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { MapView } from "@/components/Map";

/**
 * Design: Fast Food Delivery - High Conversion Focus
 * - Mobile-first layout with large touch targets
 * - Vibrant red (#DC2626) for CTAs and highlights
 * - Poppins (bold) for headlines, Roboto for body
 * - Minimal text, maximum visual impact
 * - WhatsApp integration for instant ordering
 * - Google Maps integration for location display
 */

const WHATSAPP_NUMBER = "5511999999999"; // Replace with actual number
const RESTAURANT_NAME = "Delivery Rápido";

// Horário de funcionamento (seg-dom)
const OPENING_HOURS = {
  0: { open: "11:00", close: "23:00" }, // Domingo
  1: { open: "11:00", close: "23:30" }, // Segunda
  2: { open: "11:00", close: "23:30" }, // Terça
  3: { open: "11:00", close: "23:30" }, // Quarta
  4: { open: "11:00", close: "23:30" }, // Quinta
  5: { open: "11:00", close: "00:30" }, // Sexta
  6: { open: "11:00", close: "00:30" }, // Sábado
};

// Configurações de endereço e entrega
const RESTAURANT_ADDRESS = {
  street: "Rua das Flores, 123",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipcode: "01310-100",
  lat: -23.5505,
  lng: -46.6333,
};

const DELIVERY_INFO = {
  minTime: "30 min",
  maxTime: "50 min",
  minOrder: "R$ 15,00",
  deliveryFee: "R$ 5,00",
};

// Helper function to create WhatsApp links
const createWhatsAppLink = (product: string, price?: string) => {
  const message = price
    ? `Quero pedir: ${product} (R$ ${price})`
    : `Quero pedir: ${product}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Helper function to check if restaurant is open
const isRestaurantOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  
  const hours = OPENING_HOURS[dayOfWeek as keyof typeof OPENING_HOURS];
  if (!hours) return false;
  
  return currentTime >= hours.open && currentTime < hours.close;
};

// Get formatted opening hours for today
const getTodayHours = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hours = OPENING_HOURS[dayOfWeek as keyof typeof OPENING_HOURS];
  return hours ? `${hours.open} - ${hours.close}` : "Fechado";
};

// Get full address
const getFullAddress = () => {
  return `${RESTAURANT_ADDRESS.street}, ${RESTAURANT_ADDRESS.neighborhood}, ${RESTAURANT_ADDRESS.city} - ${RESTAURANT_ADDRESS.state}`;
};

// Generate Google Maps URL
const getGoogleMapsUrl = () => {
  const address = encodeURIComponent(getFullAddress());
  return `https://www.google.com/maps/search/${address}`;
};

export default function Home() {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [todayHours, setTodayHours] = useState("");

  useEffect(() => {
    // Set initial state
    setIsOpen(isRestaurantOpen());
    setTodayHours(getTodayHours());

    // Update every minute
    const interval = setInterval(() => {
      setIsOpen(isRestaurantOpen());
      setTodayHours(getTodayHours());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMapReady = (map: any) => {
    try {
      // Add marker to the map
      const Marker = (window as any).google?.maps?.Marker;
      if (!Marker) return;
      
      new Marker({
        position: {
          lat: RESTAURANT_ADDRESS.lat,
          lng: RESTAURANT_ADDRESS.lng,
        },
        map: map,
        title: RESTAURANT_NAME,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });
      
      // Center map on restaurant
      map.setCenter({
        lat: RESTAURANT_ADDRESS.lat,
        lng: RESTAURANT_ADDRESS.lng,
      });
      map.setZoom(15);
    } catch (error) {
      console.error("Error initializing map marker:", error);
    }
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(getFullAddress());
  };

  // Open Google Maps
  const openGoogleMaps = () => {
    window.open(getGoogleMapsUrl(), "_blank");
  };

  // Open WhatsApp with delivery question
  const openWhatsAppDelivery = () => {
    const message = `Olá! Vocês fazem entrega no meu endereço? ${getFullAddress()}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Format address for display
  const getFormattedAddressLines = () => {
    return [
      RESTAURANT_ADDRESS.street,
      `${RESTAURANT_ADDRESS.neighborhood}, ${RESTAURANT_ADDRESS.city} - ${RESTAURANT_ADDRESS.state}`,
      RESTAURANT_ADDRESS.zipcode,
    ];
  };

  // Get delivery info text
  const getDeliveryInfoText = () => {
    return `${DELIVERY_INFO.minTime} a ${DELIVERY_INFO.maxTime}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* BANNER DE HORÁRIO */}
      <div className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 ${
        isOpen 
          ? "bg-green-500 hover:bg-green-600" 
          : "bg-red-600 hover:bg-red-700"
      }`}>
        <div className="container px-4 py-2 flex items-center justify-center gap-2 text-white text-sm sm:text-base">
          <Clock size={18} className="flex-shrink-0" />
          <span className="font-semibold">
            {isOpen ? "✓ Aberto" : "✕ Fechado"}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{todayHours}</span>
        </div>
      </div>

      {/* HEADER FIXO */}
      <header className="fixed top-10 left-0 right-0 bg-white shadow-md z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              🍔
            </div>
            <h1 className="text-xl font-bold text-gray-900">{RESTAURANT_NAME}</h1>
          </div>
          <a
            href={createWhatsAppLink("Quero fazer um pedido!")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Pedir agora</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="mt-40 sm:mt-28 relative h-screen sm:h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-1_1771077419000_na1fn_aGVyby1idXJnZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTFfMTc3MTA3NzQxOTAwMF9uYTFmbl9hR1Z5YnkxaWRYSm5aWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=cM79zTkveIXFzjaQGVzKwubJic93EXxPEOs3DKiqJQzVVD1hneU1HRF-Reolx4qEy7y9Mi43FJwV4fGAusWtly5jWfoWGtu9aqNxF9c2nffQt0DF~QztMqc3pstxqdFIN-f5H~ubPV22GEtZlfnEBUlMzJjE1CYG3~AzmrWW786Q6b4ZXDwC0b-zN~XvVUUe2v78EuI5ZUM5wlccB4aMgzVhliNOHiqIPxfzG5jGsPy3BrXKirqS0QXkZQXgVEUSmO-x~oO3tm5qToZ8mTXl-wmFEZ784GLYN8hZhppAgOq9IuZsRMo27wCKZFU5N2kQckVtrRSVeBrpYT6sHt~X7A__')`,
          }}
        />

        {/* Content */}
        <div className="container relative z-10 text-center text-white px-4">
          <h2 className="headline mb-4 text-white">Peça agora. Entrega rápida.</h2>
          <p className="text-lg sm:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Seu pedido direto no WhatsApp, sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={createWhatsAppLink("Quero fazer um pedido!")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <MessageCircle size={24} />
              Pedir pelo WhatsApp
            </a>
            <a
              href="#menu"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Ver cardápio
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO PROMOÇÕES */}
      <section className="pt-12 pb-12 bg-gray-50">
        <div className="container px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Promoções do Dia
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Promo Card 1 */}
            <div
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-4_1771077421000_na1fn_cHJvbW8tYmFubmVy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTRfMTc3MTA3NzQyMTAwMF9uYTFmbl9jSEp2Ylc4dFltRnVibVZ5LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Sb7JCi85YNVZEEyzgCw20eNboLwE2Sn2byUaNUHsc7Bt5DqBuWqTNJ5gJIZm464Vi2zPrbS4ndEhsfCRCxUED6QOkpdwdH3U3b-IyS78MC~kiuvl~hnRXkU7c6Gt5hHSBJdRCkYQVHfQDiWl42MbaURLgxCNDY8WvnYbfoNXmP84YnGkyzVNvmK1XkgnQOsnANhvKrU5fTT5xBAbpBfejLijY5BJ9l5MkEhgNdL3Hqq9Y0koxDdg7PYXizut7DzI13~e2qcccMi3g4Bz5y6ACq66BWqVxc0IC5StNHOiK2hIS9MzlCrMKzDvm8pBAYhK0WPRggdB4~X6MT1S-DHSHw__')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-black/60 p-6 h-48 flex flex-col justify-between">
                <div>
                  <p className="text-red-400 font-bold text-sm mb-2">COMBO</p>
                  <h4 className="text-white text-xl font-bold">
                    Combo Duplo Bacon
                  </h4>
                </div>
                <div>
                  <p className="text-white text-2xl font-bold mb-3">
                    10% OFF
                  </p>
                  <a
                    href={createWhatsAppLink("Combo Duplo Bacon")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors duration-200 inline-block"
                  >
                    Quero esse
                  </a>
                </div>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-2_1771077419000_na1fn_cGl6emEtaGVybw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTJfMTc3MTA3NzQxOTAwMF9uYTFmbl9jR2w2ZW1FdGFHVnlidy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UZOonh8E4H7PuRPPhWlXg--Oq1vMgxUI-O0mbxSHbrted9VCYaQ1abDz4E6avik2-GyJEZdsCO7J8Ff7lP9B8rBTtCU~3S~xlKl9G6Ni7CcXJ5ouoT6HfJFAeUtSfBKkA6t8tntwMOAFDBSHC2qGutiNKxbSmP~g-6F1ORY8TNQI39wKJr3ttrMBvQhw7YMDTLE8HTC~5wZBA8lEvo7HVOzduNbKQrfoyfndCcTQ2FMKmRWPMNB5l6CCG8Q0TtWriaMZDAtgm~fpAW9jDuZu7jbiTbTghIS0JMEXcxz-OXfozDGViRFi9WwzbcYoTiwH5ZPlNEHHpgNRI0uTsA27GQ__')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-black/60 p-6 h-48 flex flex-col justify-between">
                <div>
                  <p className="text-red-400 font-bold text-sm mb-2">PIZZA</p>
                  <h4 className="text-white text-xl font-bold">
                    Pizza Pepperoni Grande
                  </h4>
                </div>
                <div>
                  <p className="text-white text-2xl font-bold mb-3">
                    R$ 39,90
                  </p>
                  <a
                    href={createWhatsAppLink("Pizza Pepperoni Grande", "39,90")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors duration-200 inline-block"
                  >
                    Quero esse
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRATOS MAIS PEDIDOS */}
      <section id="menu" className="pt-12 pb-12 bg-white">
        <div className="container px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mais Pedidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Prato 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-1_1771077419000_na1fn_aGVyby1idXJnZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTFfMTc3MTA3NzQxOTAwMF9uYTFmbl9hR1Z5YnkxaWRYSm5aWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=cM79zTkveIXFzjaQGVzKwubJic93EXxPEOs3DKiqJQzVVD1hneU1HRF-Reolx4qEy7y9Mi43FJwV4fGAusWtly5jWfoWGtu9aqNxF9c2nffQt0DF~QztMqc3pstxqdFIN-f5H~ubPV22GEtZlfnEBUlMzJjE1CYG3~AzmrWW786Q6b4ZXDwC0b-zN~XvVUUe2v78EuI5ZUM5wlccB4aMgzVhliNOHiqIPxfzG5jGsPy3BrXKirqS0QXkZQXgVEUSmO-x~oO3tm5qToZ8mTXl-wmFEZ784GLYN8hZhppAgOq9IuZsRMo27wCKZFU5N2kQckVtrRSVeBrpYT6sHt~X7A__')`,
                }}
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Hambúrguer Gourmet
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Queijo derretido, bacon crocante e molho especial
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">R$ 24,90</span>
                  <a
                    href={createWhatsAppLink("Hambúrguer Gourmet", "24,90")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>

            {/* Prato 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-2_1771077419000_na1fn_cGl6emEtaGVybw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTJfMTc3MTA3NzQxOTAwMF9uYTFmbl9jR2w2ZW1FdGFHVnlidy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UZOonh8E4H7PuRPPhWlXg--Oq1vMgxUI-O0mbxSHbrted9VCYaQ1abDz4E6avik2-GyJEZdsCO7J8Ff7lP9B8rBTtCU~3S~xlKl9G6Ni7CcXJ5ouoT6HfJFAeUtSfBKkA6t8tntwMOAFDBSHC2qGutiNKxbSmP~g-6F1ORY8TNQI39wKJr3ttrMBvQhw7YMDTLE8HTC~5wZBA8lEvo7HVOzduNbKQrfoyfndCcTQ2FMKmRWPMNB5l6CCG8Q0TtWriaMZDAtgm~fpAW9jDuZu7jbiTbTghIS0JMEXcxz-OXfozDGViRFi9WwzbcYoTiwH5ZPlNEHHpgNRI0uTsA27GQ__')`,
                }}
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Pizza Pepperoni
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Massa crocante, queijo derretido e pepperoni fresco
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">R$ 39,90</span>
                  <a
                    href={createWhatsAppLink("Pizza Pepperoni", "39,90")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>

            {/* Prato 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-3_1771077417000_na1fn_Y29tYm8tZm9vZA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTNfMTc3MTA3NzQxNzAwMF9uYTFmbl9ZMjl0WW04dFptOXZaQS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Hm2bEEousiAc7lqM8kHisbIERxFF9x-E8LkPZSmuRyYU4Lz2kniqat8nIu4i2ApufIH4bQZUM~CSXvMAJ6jtTl6lHVvQ~AK8Ft~22Hd4tPhFxOJWJhrNS52QcLFqATZWLvopjoYmTy2TIqLKOCwOpQ1wC3vsgxwl7S9~UN9uC5FuTWZkYQGNzwa8tiNQ56ncTPQUZF77ozGub4Bd2SksyhquhGmAlB9UfH-ThjxDKcoPlvZBHYTlOzhWUKryS2bItMp7-4I6EJ96Gk4RSZLzWp1j1tt0qFTgNxZ~4IPZaCJq5rvkAFNq4QH6jOIVYi3Q8p3vLUpV1qgBjahfT09s0w__')`,
                }}
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Combo Completo
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Hambúrguer + batata frita + refrigerante
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">R$ 34,90</span>
                  <a
                    href={createWhatsAppLink("Combo Completo", "34,90")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>

            {/* Prato 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/OzpzynywL8Kk1jYtb7AvJL/sandbox/VnwSGsAl7XV0fyADMzHkKd-img-1_1771077419000_na1fn_aGVyby1idXJnZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3pwenlueXdMOEtrMWpZdGI3QXZKTC9zYW5kYm94L1Zud1NHc0FsN1hWMGZ5QURNekhrS2QtaW1nLTFfMTc3MTA3NzQxOTAwMF9uYTFmbl9hR1Z5YnkxaWRYSm5aWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=cM79zTkveIXFzjaQGVzKwubJic93EXxPEOs3DKiqJQzVVD1hneU1HRF-Reolx4qEy7y9Mi43FJwV4fGAusWtly5jWfoWGtu9aqNxF9c2nffQt0DF~QztMqc3pstxqdFIN-f5H~ubPV22GEtZlfnEBUlMzJjE1CYG3~AzmrWW786Q6b4ZXDwC0b-zN~XvVUUe2v78EuI5ZUM5wlccB4aMgzVhliNOHiqIPxfzG5jGsPy3BrXKirqS0QXkZQXgVEUSmO-x~oO3tm5qToZ8mTXl-wmFEZ784GLYN8hZhppAgOq9IuZsRMo27wCKZFU5N2kQckVtrRSVeBrpYT6sHt~X7A__')`,
                }}
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Duplo Bacon Especial
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Dois hambúrgueres com bacon duplo e cheddar
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">R$ 28,90</span>
                  <a
                    href={createWhatsAppLink("Duplo Bacon Especial", "28,90")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="pt-12 pb-12 bg-gray-50">
        <div className="container px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Como Funciona
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Escolha o Prato
              </h4>
              <p className="text-gray-600">
                Veja nosso cardápio e escolha o que mais te agrada
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Clique no WhatsApp
              </h4>
              <p className="text-gray-600">
                Envie seu pedido direto para nosso WhatsApp
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Receba em Casa
              </h4>
              <p className="text-gray-600">
                Entrega rápida e segura na sua porta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="pt-12 pb-12 bg-white">
        <div className="container px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            O Que Nossos Clientes Dizem
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-3">
                "Chegou rápido e delicioso! Recomendo muito!"
              </p>
              <p className="text-gray-600 font-semibold text-sm">- João Silva</p>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-3">
                "Melhor hambúrguer da região! Pedi novamente."
              </p>
              <p className="text-gray-600 font-semibold text-sm">- Maria Santos</p>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-gray-700 mb-3">
                "Entrega super rápida! Comida quentinha e fresca."
              </p>
              <p className="text-gray-600 font-semibold text-sm">- Carlos Costa</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO & ENTREGA */}
      <section id="location-section" className="pt-12 pb-12 bg-white">
        <div className="container px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Localização & Entrega
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-lg h-96 lg:h-full min-h-96">
              <MapView
                initialCenter={{
                  lat: RESTAURANT_ADDRESS.lat,
                  lng: RESTAURANT_ADDRESS.lng,
                }}
                initialZoom={15}
                onMapReady={handleMapReady}
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between">
              {/* Address Card */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-red-600 flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">Endereço</h4>
                    {getFormattedAddressLines().map((line, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={copyAddressToClipboard}
                    className="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                  >
                    Copiar
                  </button>
                  <button
                    onClick={openGoogleMaps}
                    className="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                  >
                    Google Maps
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4">
                {/* Time */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <Truck className="text-red-600 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-gray-600 text-sm">Tempo de Entrega</p>
                      <p className="text-xl font-bold text-gray-900">
                        {getDeliveryInfoText()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Min Order */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-red-600 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-gray-600 text-sm">Pedido Mínimo</p>
                      <p className="text-xl font-bold text-gray-900">
                        {DELIVERY_INFO.minOrder}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Fee */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-red-600 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-gray-600 text-sm">Taxa de Entrega</p>
                      <p className="text-xl font-bold text-gray-900">
                        {DELIVERY_INFO.deliveryFee}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={openWhatsAppDelivery}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 mt-6"
                >
                  Confirmar Entrega no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pt-16 pb-16 bg-red-600">
        <div className="container px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Com fome? Peça agora.
          </h3>
          <a
            href={createWhatsAppLink("Quero fazer um pedido!")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
          >
            Fazer Pedido no WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-8 pb-8">
        <div className="container px-4 text-center">
          <p className="mb-2">© 2026 {RESTAURANT_NAME}. Todos os direitos reservados.</p>
          <p className="text-gray-400 text-sm">
            Entrega rápida | Qualidade garantida | Peça agora!
          </p>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      {showFloatingButton && (
        <a
          href={createWhatsAppLink("Quero fazer um pedido!")}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 animate-bounce"
          title="Abrir WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}
    </div>
  );
}
