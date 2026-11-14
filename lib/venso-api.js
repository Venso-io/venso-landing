// Server-side helpers shared by server.js (local / Node hosting) and the Vercel
// functions in api/. Nothing here runs in the browser.
const fs = require('fs');
const path = require('path');

const TARIFFS_TIMEOUT_MS = Number(process.env.VENSO_API_TIMEOUT_MS || 4000);

/**
 * Base URL of the Venso backend (no trailing slash), e.g. https://api.venso.kz.
 * Empty when the landing runs without a backend.
 */
function backendUrl() {
  return String(process.env.VENSO_API_URL || '').trim().replace(/\/+$/, '');
}

/**
 * Public tariffs from the backend: GET /api/v1/tariffs (no JWT), unwrapped from
 * the { details, meta } envelope. Returns null when VENSO_API_URL is not set;
 * throws when the backend is configured but unavailable or answers garbage,
 * so the caller decides what to fall back to.
 */
async function fetchBackendTariffs() {
  const base = backendUrl();
  if (!base) return null;
  const response = await fetch(`${base}/api/v1/tariffs`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(TARIFFS_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`backend_status_${response.status}`);
  const body = await response.json();
  if (!body || !Array.isArray(body.details)) throw new Error('backend_bad_payload');
  return body.details;
}

/**
 * Revision of the legal documents published under /legal. The single source is
 * public/js/legal-content.js; the backend records registration consents with
 * the same value (venso.legal.documents-version).
 */
const LEGAL_DOCUMENTS_VERSION = (() => {
  try {
    const source = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'legal-content.js'), 'utf8');
    const match = source.match(/"version"\s*:\s*"([^"]+)"/);
    if (match) return match[1];
  } catch (error) {
    // Falls through to unknown.
  }
  return 'unknown';
})();

/**
 * Lead-form consent to personal data processing. The checkbox posts "true";
 * JSON clients may send a boolean.
 */
function hasLeadConsent(body) {
  const value = body && body.personalDataConsent;
  return value === true || value === 'true' || value === 'on';
}

/** Consent fields stored with a lead: proof of what was accepted and when. */
function leadConsentRecord(acceptedAt) {
  return {
    personalDataConsent: true,
    consentAcceptedAt: acceptedAt,
    consentDocuments: ['PERSONAL_DATA_CONSENT', 'PRIVACY_POLICY'],
    consentDocumentsVersion: LEGAL_DOCUMENTS_VERSION
  };
}

module.exports = {
  backendUrl,
  fetchBackendTariffs,
  hasLeadConsent,
  leadConsentRecord,
  LEGAL_DOCUMENTS_VERSION
};
