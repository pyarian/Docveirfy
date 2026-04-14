import { normalizeFields, canonicalize, canonicalizeAndHash } from './index';

const input = {
  doc_type:        'degree_certificate',
  reg_number:      'MU-2022-ENG-00841',
  student_name:    'Arjun Mehta',
  programme:       'Computer Engineering',
  degree_type:     'Bachelor of Engineering',
  graduation_year: 2022
};

const normalized = normalizeFields(input);
const canonical  = canonicalize(normalized);

console.log('--- Normalized ---');
console.log(JSON.stringify(normalized, null, 2));

console.log('\n--- Canonical string ---');
console.log(canonical);

canonicalizeAndHash(input).then(hash => {
  console.log('\n--- SHA-256 ---');
  console.log(hash);

  // Checks
  if (canonical.includes('graduation_year:2022') && !canonical.includes('graduation_year:"2022"')) {
    console.log('\n✓ graduation_year is correctly a number');
  } else {
    console.log('\n✗ ERROR: graduation_year became a string');
  }

  if (canonical.includes('student_name:arjun mehta')) {
    console.log('✓ student_name is correctly lowercased');
  } else {
    console.log('✗ ERROR: student_name was not lowercased');
  }

  const keys = canonical.split('|').map(pair => pair.split(':')[0]);
  const sorted = [...keys].sort();
  if (JSON.stringify(keys) === JSON.stringify(sorted)) {
    console.log('✓ Keys are correctly sorted alphabetically');
  } else {
    console.log('✗ ERROR: Keys are not sorted. Got:', keys);
  }
});