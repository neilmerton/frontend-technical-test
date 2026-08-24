import { request } from '../helpers';

describe('request Tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('Should call fetch with the given apiUrl', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await request('/api/vehicles.json');

    expect(global.fetch).toBeCalledWith('/api/vehicles.json');
  });

  it('Should resolve with the parsed JSON body on success', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'xe' }) });

    await expect(request('/api/vehicle_xe.json')).resolves.toEqual({ id: 'xe' });
  });

  it('Should reject when the response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(request('/api/vehicle_problematic.json')).rejects.toThrow();
  });

  it('Should reject when the network request itself fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(request('/api/vehicles.json')).rejects.toThrow('Network error');
  });
});
