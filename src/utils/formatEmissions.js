/**
 * Substitutes the emissions value into its display template.
 *
 * @param {{ template: string, value: number }} emissions
 * @return {string}
 */
export default function formatEmissions(emissions) {
  return emissions.template.replace('$value', emissions.value);
}
