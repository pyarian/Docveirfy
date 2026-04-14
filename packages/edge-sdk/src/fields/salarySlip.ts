import { ExtractedFields } from '../extractors/types';

export function extractSalarySlipFields(text: string): ExtractedFields {
  const get = (pattern: RegExp): string => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  return {
    doc_type:     'salary_slip',
    employee_id:  get(/emp(?:loyee)?\s*(?:id|no|code)[:\s]+([A-Z0-9\-]+)/i),
    month_year:   get(/(?:month|pay period|salary for)[:\s]+([A-Za-z]+\s+\d{4}|\d{2}[\/-]\d{4})/i),
    net_salary:   get(/net\s*(?:pay|salary)[:\s]+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{2})?)/i),
    employer_id:  get(/(?:employer|company)\s*(?:id|code)[:\s]+([A-Z0-9\-]+)/i),
    gross_salary: get(/gross\s*(?:pay|salary)[:\s]+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{2})?)/i),
  };
}
