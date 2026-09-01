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
  const settled = await Promise.allSettled(summaries.map(withDetails));

  return settled
    .filter((result) => result.status === 'fulfilled' && result.value.price)
    .map((result) => result.value);
}
