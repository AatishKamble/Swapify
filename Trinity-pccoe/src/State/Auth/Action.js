import axios from "axios";
import { API_BASE_URL } from "../../configApi/configApi";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTRER_FAILURE,
  REGISTRER_REQUEST,
  REGISTRER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from "./ActionType";

const registerRequest = () => ({ type: REGISTRER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTRER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTRER_FAILURE, payload: error });

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

const updateUserRequest = () => ({ type: UPDATE_USER_REQUEST });
const updateUserSuccess = (user) => ({ type: UPDATE_USER_SUCCESS, payload: user });
const updateUserFailure = (error) => ({ type: UPDATE_USER_FAILURE, payload: error });

const register = (userData) => async (dispatch) => {
    dispatch(registerRequest())
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData)
        const user = response.data

        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt)
        }

        console.log("user in register form action ", user)
        dispatch(registerSuccess(user.jwt))
    } catch (error) {
        dispatch(registerFailure(error.message))
    }
}

const login = (userData) => async (dispatch) => {
    dispatch(loginRequest())
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, userData)
        const user = response.data
        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt)
            window.location.reload()
        }

        dispatch(loginSuccess(user.jwt))
    } catch (error) {
        dispatch(loginFailure(error.message))
    }
}

const getUserProfile = (jwt) => async (dispatch) => {
    dispatch(getUserRequest())
    try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                authorization: `Bearer ${jwt}`,
            },
        })
        const user = response.data
        dispatch(getUserSuccess(user))
    } catch (error) {
        dispatch(getUserFailure(error.message))
    }
}

const updateUserProfile = (userData) => async (dispatch) => {
    dispatch(updateUserRequest())
    try {
        const jwt = localStorage.getItem("jwt")
        if (!jwt) {
            throw new Error("Authentication token not found")
        }

        const response = await axios.put(`${API_BASE_URL}/api/users/update`, userData, {
            headers: {
                authorization: `Bearer ${jwt}`,
            },
        })

        const updatedUser = response.data
        console.log("Updated user profile:", updatedUser)
        dispatch(updateUserSuccess(updatedUser))

        return updatedUser
    } catch (error) {
        console.error("Error updating user profile:", error)
        dispatch(updateUserFailure(error.message))
        throw error
    }
}

const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
    localStorage.clear()
}

export { register, login, logout, getUserProfile, updateUserProfile }
