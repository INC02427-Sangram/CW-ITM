// Mock fetchWrapper for Jest tests
const fetchWrapper = jest.fn((url, options) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
  });
});

module.exports = fetchWrapper;
