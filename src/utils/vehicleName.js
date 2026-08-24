const HYPHENATE_THRESHOLD = 3;

/**
 * Derives a display name from a vehicle id (e.g. "ftype" -> "F-TYPE").
 * The API never provides a display name, only a lowercase id. Known ids follow
 * a "single letter + word" convention for longer names (ftype, fpace, ipace)
 * and a plain short code for others (xe, xf, xj), so ids longer than
 * HYPHENATE_THRESHOLD get a hyphen after the first letter.
 *
 * @param {string} id
 * @return {string}
 */
export default function deriveVehicleName(id) {
  if (id.length > HYPHENATE_THRESHOLD) {
    return `${id[0]}-${id.slice(1)}`.toUpperCase();
  }

  return id.toUpperCase();
}
