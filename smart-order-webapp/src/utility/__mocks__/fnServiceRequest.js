// Mock fnServiceRequest for Jest tests
const fnServiceRequest = jest.fn((url, method, onSuccess, onError, payload) => {
  if (onSuccess) {
    onSuccess({ data: [] });
  }
  return Promise.resolve({ data: [] });
});

export default fnServiceRequest;
