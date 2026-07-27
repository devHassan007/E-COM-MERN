import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, clearOrderSuccess } from '../../Redux/orderSlice';
import { clearCart } from '../../Redux/cartSlice';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiMapPin, 
  FiCreditCard, 
  FiPackage,
  FiShield,
  FiTruck,
  FiEdit2
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { success, loading, error } = useSelector((state) => state.order);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const savedPayment = sessionStorage.getItem('paymentMethod');
    if (savedPayment) {
      setPaymentMethod(JSON.parse(savedPayment));
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const codFee = paymentMethod?.method === 'cod' ? 2 : 0;
  const total = subtotal + tax + shipping + codFee;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryEndDate = new Date();
  deliveryEndDate.setDate(deliveryEndDate.getDate() + 7);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (success) {
      dispatch(clearOrderSuccess());
      dispatch(clearCart());
      sessionStorage.removeItem('paymentMethod');
      navigate('/order-success');
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch, navigate]);

  const handlePlaceOrder = () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    const paymentMethodName = 
      paymentMethod?.method === 'card' ? 'Credit/Debit Card' :
      paymentMethod?.method === 'upi' ? 'UPI' : 'Cash on Delivery';

    const orderData = {
      shippingInfo,
      orderItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product,
      })),
      paymentInfo: {
        id: `PAY_${Date.now()}`,
        status: paymentMethod?.method === 'cod' ? 'Pending' : 'Paid',
        paidAt: new Date().toISOString(),
        method: paymentMethodName,
      },
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping + codFee,
      totalPrice: total,
    };

    dispatch(createOrder(orderData));
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!shippingInfo.address) {
    navigate('/shipping');
    return null;
  }

  if (!paymentMethod) {
    navigate('/payment');
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
          <div className="w-8 sm:w-16 h-1 bg-green-500 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <FiCheck />
            </div>
            <span className="ml-2 text-green-400 font-medium hidden sm:block">Payment</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-amber-500 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
              4
            </div>
            <span className="ml-2 text-amber-400 font-medium hidden sm:block">Confirm</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Review Your Order</h1>
          <p className="text-gray-400">Please review your order details before placing the order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FiMapPin className="text-blue-400 text-xl" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Delivery Address</h2>
                </div>
                <Link to="/shipping" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm">
                  <FiEdit2 size={14} />
                  Change
                </Link>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 mt-1">{shippingInfo.address}</p>
                <p className="text-gray-400">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.pinCode}</p>
                <p className="text-gray-400">{shippingInfo.country}</p>
                <p className="text-gray-400 mt-2">Phone: {shippingInfo.phoneNo}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FiCreditCard className="text-green-400 text-xl" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Payment Method</h2>
                </div>
                <Link to="/payment" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm">
                  <FiEdit2 size={14} />
                  Change
                </Link>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <FiCreditCard className="text-gray-300 text-xl" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {paymentMethod?.method === 'card' && 'Credit/Debit Card'}
                    {paymentMethod?.method === 'upi' && 'UPI Payment'}
                    {paymentMethod?.method === 'cod' && 'Cash on Delivery'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {paymentMethod?.method === 'card' && `Card ending in ${paymentMethod.details?.last4 || '****'}`}
                    {paymentMethod?.method === 'upi' && paymentMethod.details?.upiId}
                    {paymentMethod?.method === 'cod' && 'Pay when delivered'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FiPackage className="text-purple-400 text-xl" />
                </div>
                <h2 className="text-lg font-bold text-white">Order Items ({cartItems.length})</h2>
              </div>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="text-white font-medium hover:text-amber-400">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-400">Price: <span className="text-white">${item.price.toFixed(2)}</span></span>
                        <span className="text-gray-400">Qty: <span className="text-white">{item.quantity}</span></span>
                      </div>
                    </div>
                    <p className="text-amber-400 font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <FiTruck className="text-green-400 text-2xl" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold">Estimated Delivery</p>
                  <p className="text-white text-lg">{formatDate(deliveryDate)} - {formatDate(deliveryEndDate)}</p>
                  <p className="text-gray-400 text-sm mt-1">Standard Delivery • {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>COD Fee</span>
                    <span className="text-white">${codFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-4 flex justify-between">
                  <span className="text-lg font-semibold text-white">Order Total</span>
                  <span className="text-2xl font-bold text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6 p-4 bg-gray-900/50 rounded-lg">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-amber-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the <span className="text-amber-400">Terms & Conditions</span> and <span className="text-amber-400">Privacy Policy</span>
                </label>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !termsAccepted}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiShield />
                    Place Order • ${total.toFixed(2)}
                  </>
                )}
              </button>

              <Link
                to="/payment"
                className="w-full flex items-center justify-center gap-2 py-3 mt-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                <FiArrowLeft />
                Back to Payment
              </Link>

              <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-center gap-2 text-green-400 text-sm">
                <FiShield />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
