// Mock fnAdminConsoleGetAll for Jest tests
export const fnGetAllCountries = jest.fn((onSuccess) => {
  if (onSuccess) {
    onSuccess({ data: [] });
  }
  return Promise.resolve({ data: [] });
});

export const fnGetAllPlants = jest.fn((onSuccess) => {
  if (onSuccess) {
    onSuccess({ data: [] });
  }
  return Promise.resolve({ data: [] });
});

export default {
  fnGetAllCountries,
  fnGetAllPlants,
};
