import deriveVehicleName from './vehicleName';

/**
 * Recursively flattens any value (string, number, array, or plain object)
 * into a list of primitive strings. Meta is an open-ended bag of vehicle
 * attributes (drivetrain, bodystyles, emissions, ...), so this stays generic
 * rather than naming individual fields, meaning new meta fields are
 * automatically searchable without a change here.
 *
 * @param {*} value
 * @return {Array.<string>}
 */
function flattenToWords(value) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenToWords);
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(flattenToWords);
  }

  return [String(value)];
}

/**
 * Builds the lowercase, space-separated text a vehicle can be matched
 * against: its display name, description, and every value found in meta.
 *
 * @param {Object} vehicle
 * @return {string}
 */
function buildSearchIndex(vehicle) {
  const { id, description, meta } = vehicle;
  const words = [deriveVehicleName(id), description, ...flattenToWords(meta)];

  return words.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Filters vehicles against a free-text search query. The query is split on
 * whitespace and a vehicle matches if ANY term is found anywhere in its
 * name, description, or meta data (case-insensitive substring match).
 * An empty/whitespace-only query returns every vehicle unfiltered.
 *
 * @param {Array.<Object>} vehicles
 * @param {string} query
 * @return {Array.<Object>}
 */
export function filterVehicles(vehicles, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return vehicles;
  }

  return vehicles.filter((vehicle) => {
    const index = buildSearchIndex(vehicle);

    return terms.some((term) => index.includes(term));
  });
}

export default filterVehicles;
