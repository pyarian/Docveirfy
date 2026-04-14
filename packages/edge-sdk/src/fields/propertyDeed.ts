import { ExtractedFields } from '../extractors/types';

export function extractPropertyDeedFields(text: string): ExtractedFields {
  const get = (pattern: RegExp): string => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  return {
    doc_type:             'property_deed',
    registration_number:  get(/reg(?:istration)?\s*(?:no|number)[:\s]+([A-Z0-9\-\/]+)/i),
    owner_name:           get(/(?:owner|purchaser|buyer|grantee)[:\s]+([A-Za-z\s]+)/i),
    registered_date:      get(/(?:registered on|date of registration)[:\s]+(\d{1,2}[\/-]\d{1,2}[\/-]\d{4}|\d{4}[\/-]\d{2}[\/-]\d{2})/i),
    district:             get(/(?:district|taluk)[:\s]+([A-Za-z\s]+)/i),
    plot_area_sqft:       get(/(?:area|plot area)[:\s]+([\d,]+(?:\.\d+)?)\s*(?:sq\.?\s*ft|sqft)/i),
  };
}
