import API from './config';

// Get all products (with optional search, filter, pagination)
export const getAllProducts = (keyword = '', page = 1, price = [0, 100000], category = '', ratings = 0) => {
  let url = `/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
  
  if (category) {
    url += `&category=${category}`;
  }
  
  return API.get(url);
};

// Get single product details
export const getProductDetails = (id) => API.get(`/product/${id}`);

// Create product review
export const createReview = (reviewData) => API.put('/review', reviewData);

// Get product reviews
export const getProductReviews = (productId) => API.get(`/reviews?id=${productId}`);
