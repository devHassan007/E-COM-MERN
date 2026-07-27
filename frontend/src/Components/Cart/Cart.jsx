import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartQuantity } from '../../Redux/cartSlice';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (productId, currentQty, change, stock) => {
    const newQty = currentQty + change;
    if (newQty >= 1 && newQty <= stock) {
      dispatch(updateCartQuantity({ productId, quantity: newQty }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="mx-auto text-6xl text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/product"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-400">
            ShopEasy
          </Link>
          <Link
            to="/product"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart ({cartItems.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <Link to={`/product/${item.product}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item.product}`}
                      className="text-lg font-semibold text-white hover:text-amber-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-amber-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.product, item.quantity, -1, item.stock)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-white"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product, item.quantity, 1, item.stock)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-white"
                        disabled={item.quantity >= item.stock}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.product)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-sm text-amber-400">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-gray-700 pt-4 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl transition-colors"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
