import { AUTH_ACTIONS } from '../constants/actionTypes';

// Action Creators
export const loginRequest = (email: string, password: string) => ({
  type: AUTH_ACTIONS.LOGIN_REQUEST,
  payload: { email, password },
});

export const loginSuccess = (user: any) => ({
  type: AUTH_ACTIONS.LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error: string) => ({
  type: AUTH_ACTIONS.LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: AUTH_ACTIONS.LOGOUT,
});

export const registerRequest = (userData: any) => ({
  type: AUTH_ACTIONS.REGISTER_REQUEST,
  payload: userData,
});

export const registerSuccess = (user: any) => ({
  type: AUTH_ACTIONS.REGISTER_SUCCESS,
  payload: user,
});

export const registerFailure = (error: string) => ({
  type: AUTH_ACTIONS.REGISTER_FAILURE,
  payload: error,
}); 