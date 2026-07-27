import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiCheck, 
  FiCreditCard, 
  FiDollarSign, 
  FiSmartphone,
  FiArrowLeft,
  FiArrowRight,
  FiShield,
  FiLock
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: FiCreditCard,
      description: 'Visa, Mastercard, American Express',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: FiSmartphone,
      description: 'Google Pay, PhonePe, Paytm',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: FiDollarSign,
      description: 'Pay when you receive',
    },
  ];

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
      if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Invalid card number');
        return;
      }
    }

    if (selectedMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    // Save payment method to session/localStorage for confirm order page
    const paymentData = {
      method: selectedMethod,
      details: selectedMethod === 'card' ? { last4: cardDetails.cardNumber.slice(-4) } : 
               selectedMethod === 'upi' ? { upiId } : {}
    };
    sessionStorage.setItem('paymentMethod', JSON.stringify(paymentData));
    
    navigate('/confirm-order');
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!shippingInfo.address) {
    navigate('/shipping');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <FiCheck />
            </div>
            <span className="ml-2 text-green-400 font-medium hidden sm:block">Cart</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-green-500 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <FiCheck />
            </div>
            <span className="ml-2 text-green-400 font-medium hidden sm:block">Shipping</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-amber-500 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
              3
            </div>
            <span className="ml-2 text-amber-400 font-medium hidden sm:block">Payment</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gray-700 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
              4
            </div>
            <span className="ml-2 text-gray-400 font-medium hidden sm:block">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiLock className="text-green-400 text-xl" />
                <h2 className="text-xl font-bold text-white">Secure Payment</h2>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id ? 'border-amber-500' : 'border-gray-500'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        selectedMethod === method.id ? 'bg-amber-500/20' : 'bg-gray-700'
                      }`}>
                        <method.icon className={`text-xl ${
                          selectedMethod === method.id ? 'text-amber-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{method.name}</p>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                      </div>
                    </div>

                    {/* Card Details Form */}
                    {selectedMethod === 'card' && method.id === 'card' && (
                      <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardName"
                            value={cardDetails.cardName}
                            onChange={handleCardChange}
                            placeholder="John Doe"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Expiry Date</label>
                            <input
                              type="text"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleCardChange}
                              placeholder="MM/YY"
                              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">CVV</label>
                            <input
                              type="password"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardChange}
                              placeholder="•••"
                              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Form */}
                    {selectedMethod === 'upi' && method.id === 'upi' && (
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <label className="block text-gray-400 text-sm mb-2">UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    {/* COD Info */}
                    {selectedMethod === 'cod' && method.id === 'cod' && (
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <FiDollarSign className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-yellow-400 font-medium">Cash on Delivery</p>
                            <p className="text-gray-400 text-sm mt-1">
                              Pay with cash when your order is delivered. An additional fee of $2 will be charged for COD orders.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-2 text-gray-400">
                <FiShield className="text-green-400" />
                <span className="text-sm">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiLock className="text-green-400" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiCreditCard className="text-green-400" />
                <span className="text-sm">PCI Compliant</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              {/* Mini Cart Items */}
              <div className="max-h-48 overflow-y-auto space-y-3 mb-4 pr-2">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-amber-400 text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {selectedMethod === 'cod' && (
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>COD Fee</span>
                    <span className="text-white">$2.00</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-amber-400">
                    ${(total + (selectedMethod === 'cod' ? 2 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl transition-colors"
                >
                  Review Order
                  <FiArrowRight />
                </button>
                <Link
                  to="/shipping"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                >
                  <FiArrowLeft />
                  Back to Shipping
                </Link>
              </div>

              {/* Delivery Address Preview */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Delivering to:</p>
                <p className="text-white text-sm">{shippingInfo.address}</p>
                <p className="text-gray-400 text-sm">
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pinCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
