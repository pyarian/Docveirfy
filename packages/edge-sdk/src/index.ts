// Core pipeline — works everywhere
export { validateFields, normalizeFields, canonicalize, hashCanonical, canonicalizeAndHash } from './canonicalize';

// Field extractors — works everywhere (pure regex)
export { extractDegreeFields }      from './fields/degree';
export { extractSalarySlipFields }  from './fields/salarySlip';
export { extractPropertyDeedFields } from './fields/propertyDeed';
export { extractJEEAdmitCardFields } from './fields/jeeAdmitCard';
// Types
export type { ExtractedFields } from './extractors/types';

// NOTE: Do NOT export browser.ts or node.ts from here.
// Import them directly where needed:
//   browser: import { extractTextBrowser } from '@docverify/edge-sdk/src/extractors/browser'
//   node:    import { extractTextNode }    from '@docverify/edge-sdk/src/extractors/node'
