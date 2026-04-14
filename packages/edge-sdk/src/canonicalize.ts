// Define required and optional fields per doc_type
const fieldSchemas: Record<string, { required: string[], optional: string[] }> = {
  degree_certificate: {
    required: ['doc_type', 'reg_number', 'student_name', 'graduation_year'],
    optional: ['programme', 'degree_type']
  },
  property_deed: {
    required: ['doc_type', 'registration_number', 'owner_name', 'registered_date'],
    optional: ['district', 'plot_area_sqft']
  },
  salary_slip: {
    required: ['doc_type', 'employee_id', 'month_year', 'net_salary'],
    optional: ['employer_id', 'gross_salary']
  },
};

// 0. Validate — only required fields are enforced
export function validateFields(fields: Record<string, any>): void {
  const docType = fields['doc_type'];

  if (!docType) {
    throw new Error('Missing field: doc_type');
  }

  const schema = fieldSchemas[docType];

  if (!schema) {
    throw new Error(`Unknown doc_type: ${docType}`);
  }

  // Only throw if a REQUIRED field is missing
  for (const field of schema.required) {
    if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
      throw new Error(`Missing required field: ${field} for doc_type: ${docType}`);
    }
  }

  // Optional fields — just log a warning, don't throw
  for (const field of schema.optional) {
    if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
      console.warn(`Optional field not found: ${field} for doc_type: ${docType} — skipping`);
    }
  }
}

// 1. Normalize
export function normalizeFields(fields: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string') {
      normalized[key] = value.trim().toLowerCase();
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

// 2. Canonicalize — only include fields present in schema (required + optional if present)
export function canonicalize(fields: Record<string, any>): string {
  const docType = fields['doc_type'];
  const schema = fieldSchemas[docType];

  // Build the allowed field list — required + optional fields that actually exist
  const allowedFields = [
    ...schema.required,
    ...schema.optional.filter(f => fields[f] !== undefined && fields[f] !== null && fields[f] !== '')
  ];

  return allowedFields
    .sort()                                    // alphabetical — CRITICAL
    .map(key => `${key}:${fields[key]}`)
    .join('|');
}

// 3. Hash
export async function hashCanonical(canonicalString: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(canonicalString)
  );
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// 4. Full pipeline
export async function canonicalizeAndHash(fields: Record<string, any>): Promise<string> {
  validateFields(fields);
  const normalized = normalizeFields(fields);
  const canonical = canonicalize(normalized);
  return hashCanonical(canonical);
}