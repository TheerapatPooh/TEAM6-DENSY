import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios, { AxiosRequestConfig } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// tools/api.ts

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 5000, // Timeout if necessary
  headers: {
    'Content-Type': 'application/json', // Corrected 'ContentType' to 'Content-Type'
    // Add all custom headers here
  },
});

export const fetchData = async (url: string, options: AxiosRequestConfig = {}) => {
  try {
    const response = await axiosInstance(url, options);
    return response.data;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Could not get data');
  }
};
