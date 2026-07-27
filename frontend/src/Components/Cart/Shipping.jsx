import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../../Redux/cartSlice';
import { FiMapPin, FiPhone, FiMap, FiHome, FiArrowRight, FiCheck, FiX, FiNavigation } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Pakistan',
  'China',
  'Japan',
];

// Mapbox access token (you should add your own token)
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    address: shippingInfo.address || '',
    city: shippingInfo.city || '',
    state: shippingInfo.state || '',
    country: shippingInfo.country || '',
    pinCode: shippingInfo.pinCode || '',
    phoneNo: shippingInfo.phoneNo || '',
    latitude: shippingInfo.latitude || 31.5204, // Default: Lahore
    longitude: shippingInfo.longitude || 74.3587,
  });

  const [showMap, setShowMap] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: formData.longitude,
    latitude: formData.latitude,
    zoom: 12
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Reverse geocoding to get address
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const place = data.features[0];
          const context = place.context || [];

          // Extract address components
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';

          context.forEach(item => {
            if (item.id.includes('place')) city = item.text;
            if (item.id.includes('region')) state = item.text;
            if (item.id.includes('country')) country = item.text;
            if (item.id.includes('postcode')) postalCode = item.text;
          });

          setFormData(prev => ({
            ...prev,
            address: place.place_name || prev.address,
            city: city || prev.city,
            state: state || prev.state,
            country: country || prev.country,
            pinCode: postalCode || prev.pinCode,
          }));

          toast.success('Location selected! Address fields updated.');
        }
      })
      .catch(error => {
        console.error('Geocoding error:', error);
        toast.error('Failed to fetch address details');
      });
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, latitude, longitude }));
          setViewState(prev => ({ ...prev, latitude, longitude, zoom: 15 }));
          toast.success('Current location detected!');
        },
        (error) => {
          toast.error('Unable to get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.address || !formData.city || !formData.state || !formData.country || !formData.pinCode || !formData.phoneNo) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.phoneNo.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    dispatch(saveShippingInfo(formData));
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <FiCheck />
            </div>
            <span className="ml-2 text-green-400 font-medium hidden sm:block">Cart</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-green-500 to-amber-500 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-gray-900 font-bold shadow-lg shadow-amber-500/50">
              2
            </div>
            <span className="ml-2 text-amber-400 font-medium hidden sm:block">Shipping</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gray-700 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
              3
            </div>
            <span className="ml-2 text-gray-400 font-medium hidden sm:block">Payment</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gray-700 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
              4
            </div>
            <span className="ml-2 text-gray-400 font-medium hidden sm:block">Confirm</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <FiMapPin className="text-amber-500" />
            Shipping Details
          </h1>

          {/* Map Toggle Button */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 text-white rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              <FiMap size={20} />
              {showMap ? 'Hide Map' : 'Select Location on Map'}
            </button>
          </div>

          {/* Map Section */}
          {showMap && (
            <div className="mb-6 rounded-xl overflow-hidden border-2 border-amber-500/20 shadow-xl">
              <div className="relative">
                <Map
                  {...viewState}
                  onMove={evt => setViewState(evt.viewState)}
                  onClick={handleMapClick}
                  style={{ width: '100%', height: '400px' }}
                  mapStyle="mapbox://styles/mapbox/dark-v11"
                  mapboxAccessToken={MAPBOX_TOKEN}
                >
                  <Marker
                    longitude={formData.longitude}
                    latitude={formData.latitude}
                    anchor="bottom"
                  >
                    <div className="relative">
                      <FiMapPin size={40} className="text-amber-500 drop-shadow-lg animate-bounce" />
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-500/30 rounded-full blur-sm"></div>
                    </div>
                  </Marker>
                  <NavigationControl position="top-right" />
                  <GeolocateControl position="top-right" />
                </Map>

                <button
                  type="button"
                  onClick={() => setShowMap(false)}
                  className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiX size={20} />
                </button>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="absolute bottom-4 left-4 flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-semibold shadow-lg"
                >
                  <FiNavigation size={18} />
                  Use My Location
                </button>
              </div>
              <div className="bg-gray-900/50 p-3 text-center text-gray-400 text-sm">
                Click anywhere on the map to select your delivery location
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Address */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                <FiHome className="text-amber-500" />
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                  <FiMapPin className="text-amber-500" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                  <FiMap className="text-amber-500" />
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Pin Code & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Postal/Zip Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                  <FiPhone className="text-amber-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/30 text-gray-900 font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] mt-6 text-lg"
            >
              Continue to Payment
              <FiArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
