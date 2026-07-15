// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Vite environment variables for Jest
// import.meta.env is transformed to process.env by Babel
process.env.VITE_APP_ViatrisOData_Destinations = process.env.VITE_APP_ViatrisOData_Destinations || 'mock-destination';
process.env.VITE_APP_ViatrisOData_BaseUrl = process.env.VITE_APP_ViatrisOData_BaseUrl || 'http://mock-url';
