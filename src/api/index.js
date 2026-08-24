import { request } from './helpers';

/**
 * Fetches a vehicle's detail payload and merges it into its summary.
 * Any failure here (broken apiUrl, network error, ...) is left to reject
 * so the caller can drop that single vehicle without affecting the rest.
 *
 * @param {vehicleSummaryPayload} summary
 * @return {Promise<Object>}
 */
async function withDetails(summary) {
  const details = await request(summary.apiUrl);

  return { ...summary, ...details };
}

/**
 * Pull vehicles information
 *
 * @return {Promise<Array.<vehicleSummaryPayload>>}
 */
export default async function getData() {
  const summaries = await request('/api/vehicles.json');
  const results = await Promise.all(
    summaries.map((summary) => withDetails(summary).catch(() => null)),
  );

  return results
    .filter((vehicle) => vehicle && vehicle.price && vehicle.price.trim());
}
