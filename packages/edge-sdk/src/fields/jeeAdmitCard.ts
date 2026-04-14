import { ExtractedFields } from '../extractors/types';

export function extractJEEAdmitCardFields(text: string): ExtractedFields {
  const get = (pattern: RegExp): string => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  return {
    doc_type:           'jee_admit_card',
    roll_number:        get(/Roll\s*Number[:\s]+([A-Z0-9]+)/i),
    application_number: get(/Application\s*Number[:\s]+([\d]+)/i),
    candidate_name:     get(/Candidate'?s?\s*Name[:\s]+([A-Za-z\s]+?)(?=Father|Gender|$)/i),
    father_name:        get(/Father'?s?\s*Name[:\s]+([A-Za-z\s]+?)(?=Gender|Date|$)/i),
    date_of_birth:      get(/Date\s*of\s*Birth[:\s]+(\d{2}-\d{2}-\d{4})/i),
    gender:             get(/Gender[:\s]+(Male|Female|Other)/i),
    category:           get(/Category[:\s]+(General|OBC|SC|ST|EWS)/i),
    state_of_eligibility: get(/State\s*of\s*Eligibility[:\s]+([A-Z]+)/i),
    exam_date:          get(/Date\s*of\s*Examination[:\s]+(\d{2}-\d{2}-\d{4})/i),
    exam_shift:         get(/Shift[:\s]+(Shift\s*\d)/i),
    paper:              get(/Applied\s*For[:\s]+(Paper\s*\d[^a-z\n]*)/i),
    exam_year:          get(/JEE.*?(\d{4})/i),
  };
}
