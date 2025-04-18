import { api } from "../../configApi/configApi.js";

import { 
    SELL_PRODUCT_REQUEST, SELL_PRODUCT_SUCCESS, SELL_PRODUCT_FAILURE, 
    FIND_PRODUCTS_REQUEST, FIND_PRODUCTS_SUCCESS, FIND_PRODUCTS_FAILURE, 
    FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS, FIND_PRODUCT_BY_ID_FAILURE, 
    CANCEL_REQUEST_REQUEST, CANCEL_REQUEST_SUCCESS, CANCEL_REQUEST_FAILURE ,
    GET_SOLD_PRODUCTS_REQUEST, GET_SOLD_PRODUCTS_SUCCESS, GET_SOLD_PRODUCTS_FAILURE,
    GET_SELL_REQUESTS_REQUEST, GET_SELL_REQUESTS_SUCCESS, GET_SELL_REQUESTS_FAILURE ,
    ACCEPT_SELL_REQUEST_REQUEST, ACCEPT_SELL_REQUEST_SUCCESS, ACCEPT_SELL_REQUEST_FAILURE, 
    REJECT_SELL_REQUEST_REQUEST, REJECT_SELL_REQUEST_SUCCESS, REJECT_SELL_REQUEST_FAILURE,
    ACCEPT_CANCEL_REQUEST_REQUEST, ACCEPT_CANCEL_REQUEST_SUCCESS, ACCEPT_CANCEL_REQUEST_FAILURE,
    REJECT_CANCEL_REQUEST_REQUEST, REJECT_CANCEL_REQUEST_SUCCESS, REJECT_CANCEL_REQUEST_FAILURE,
} from "./ActionType.js";

export const findProducts = (reqData) => async (dispatch) => {
    dispatch({ type: FIND_PRODUCTS_REQUEST });
    const { category, minPrice, maxPrice, sort, pageNumber, pageSize } = reqData;
    
    try {
        const { data } = await api.get(`/api/products?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
        dispatch({ type: FIND_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FIND_PRODUCTS_FAILURE, payload: error.message });
    }
};

export const findProductById = (reqData) => async (dispatch) => {
    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });
    const { productId } = reqData;
    try {
        const { data } = await api.get(`/api/products/id/${productId}`);
        dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FIND_PRODUCT_BY_ID_FAILURE, payload: error.message });
    }
};

export const sellProduct = (productData, jwt) => async (dispatch) => {
  dispatch({ type: SELL_PRODUCT_REQUEST })
  try {
    const { data } = await api.post(`/api/user/sell-product/`, productData, {
      headers: {
        authorization: `Bearer ${jwt}`,
        "Content-Type": "multipart/form-data",
      },
    })

    dispatch({ type: SELL_PRODUCT_SUCCESS, payload: data })
    return { success: true, data }
  } catch (error) {
    dispatch({ type: SELL_PRODUCT_FAILURE, payload: error.message })
    return { success: false, error: error.message }
  }
}

// Cancel request action
export const cancelRequest = (requestId) => async (dispatch) => {
    dispatch({ type: CANCEL_REQUEST_REQUEST });
    try {
        const { data } = await api.post(`/api/user/sell-product/id/${requestId}`);
        dispatch({ type: CANCEL_REQUEST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CANCEL_REQUEST_FAILURE, payload: error.message });
    }
};

// Function to fetch sold products modification
export const getSellProducts = () => async (dispatch) => {
    dispatch({ type: GET_SOLD_PRODUCTS_REQUEST });

    try {
        const res = await api.get(`/api/user/sell-product`);
        dispatch({ type: GET_SOLD_PRODUCTS_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: GET_SOLD_PRODUCTS_FAILURE, payload: error.message });
    }
};

export const searchProducts = (query) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/products/search?q=${encodeURIComponent(query)}`)
        return data
    } catch (error) {
        console.error("Error searching products:", error)
        return { content: [] }
    }
}

// Updated getProductRequestStats function
export const getProductRequestStats = () => async (dispatch) => {
  try {
    // First try to get stats from the backend
    const { data } = await api.get("/api/admin/product_request/stats")
    return data
  } catch (error) {
    console.error("Error fetching product request stats:", error)

    // If backend call fails, try to calculate stats from existing requests
    try {
      const requestsResponse = await api.get("/api/admin/product_request")
      const requests = requestsResponse.data.content || []

      // Calculate stats from requests
      const pendingRequests = requests.filter((req) => req.state === "sellrequest").length
      const totalProducts = requests.length
      const uniqueSellers = new Set(requests.map((req) => req.user?._id).filter(Boolean))
      const activeSellers = uniqueSellers.size

      return {
        totalProducts,
        activeSellers,
        pendingRequests,
      }
    } catch (innerError) {
      console.error("Error calculating stats from requests:", innerError)
      return {
        totalProducts: 0,
        activeSellers: 0,
        pendingRequests: 0,
      }
    }
  }
}

// Get all sell requests
export const getSellRequests = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SELL_REQUESTS_REQUEST })
    const { data } = await api.get("/api/admin/product_request")
    dispatch({ type: GET_SELL_REQUESTS_SUCCESS, payload: data.content })
    return data
  } catch (error) {
    dispatch({ type: GET_SELL_REQUESTS_FAILURE, payload: error.message })
    throw error
  }
}

// Accept a sell request
export const acceptSellRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: ACCEPT_SELL_REQUEST_REQUEST })
    const { data } = await api.post(`/api/admin/product_request/${id}`)
    dispatch({ type: ACCEPT_SELL_REQUEST_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: ACCEPT_SELL_REQUEST_FAILURE, payload: error.message })
    throw error
  }
}

// Reject a sell request
export const rejectSellRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: REJECT_SELL_REQUEST_REQUEST })
    const { data } = await api.delete(`/api/admin/product_request/id/${id}`)
    dispatch({ type: REJECT_SELL_REQUEST_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: REJECT_SELL_REQUEST_FAILURE, payload: error.message })
    throw error
  }
}

// Accept a cancel request
export const acceptCancelRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: ACCEPT_CANCEL_REQUEST_REQUEST })
    const { data } = await api.post(`/api/admin/product_request/cancel/${id}`)
    dispatch({ type: ACCEPT_CANCEL_REQUEST_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: ACCEPT_CANCEL_REQUEST_FAILURE, payload: error.message })
    throw error
  }
}

// Reject a cancel request
export const rejectCancelRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: REJECT_CANCEL_REQUEST_REQUEST })
    const { data } = await api.delete(`/api/admin/product_request/cancel/id/${id}`)
    dispatch({ type: REJECT_CANCEL_REQUEST_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: REJECT_CANCEL_REQUEST_FAILURE, payload: error.message })
    throw error
  }
}