import { ExtractedFields } from '../extractors/types';

export function extractDegreeFields(text: string): ExtractedFields {
  const get = (pattern: RegExp): string => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  return {
    doc_type:        'degree_certificate',
    reg_number:      get(/reg(?:istration)?\s*(?:no|number)[:\s]+([A-Z0-9\-\/]+)/i),
    student_name:    get(/(?:this is to certify that|name of student|student name)[:\s]+([A-Za-z\s]+)/i),
    graduation_year: get(/(?:year of graduation|passed in|awarded in)[:\s]+(\d{4})/i),
    programme:       get(/(?:programme|program|course)[:\s]+([A-Za-z\s]+)/i),
    degree_type:     get(/(?:degree|bachelor|master|phd|b\.tech|m\.tech)[:\s]*([A-Za-z\s]*)/i),
  };
}
