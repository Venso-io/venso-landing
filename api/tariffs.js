const { fetchBackendTariffs } = require('../lib/venso-api');

/**
 * Public tariffs for the pricing section, proxied from the Venso backend
 * (VENSO_API_URL + /api/v1/tariffs). Without the backend the list is empty and
 * the page renders its built-in copy of the backend seed.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const tariffs = await fetchBackendTariffs();
    if (tariffs) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).json({ source: 'venso-api', tariffs });
    }
  } catch (error) {
    console.warn(`Venso API tariffs unavailable: ${error.message}`);
  }
  res.setHeader('Cache-Control', 's-maxage=30');
  return res.status(200).json({ source: 'unavailable', tariffs: [] });
};
