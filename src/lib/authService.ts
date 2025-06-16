
// src/lib/authService.ts
'use server'; // Marking this for potential future server-side use, though fetch is client-side here.

import type { ApiUser } from '@/types';

const API_BASE_URL = 'https://tienganhivy.com/api';

interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  passwd: string;
  passed_confirm: string; // Assuming this is password_confirmation
}

interface SignupResponse {
  // Define based on your actual signup API response
  // For example, if it returns the user object and a message:
  // user?: ApiUser;
  message?: string;
  error?: string;
}

export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.detail || data.message || 'Signup failed. Please try again.' };
    }
    return data; // Or { message: "Signup successful!" } if API doesn't return user
  } catch (error) {
    console.error('Signup API error:', error);
    return { error: 'An unexpected error occurred during signup.' };
  }
}

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  user?: ApiUser;
  token?: string;
  login_counts?: number;
  error?: string;
  detail?: string; // Common for Django Rest Framework errors
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data: LoginResponse = await response.json();
    if (!response.ok) {
      return { error: data.detail || data.error || 'Login failed. Please check your credentials.' };
    }
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    return { error: 'An unexpected error occurred during login.' };
  }
}
