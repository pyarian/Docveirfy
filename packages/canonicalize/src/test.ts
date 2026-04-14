import { canonicalizeAndHash } from "./index";

// Example input (your teammate's document fields)
const input = {
  doc_type: "jee_admit_card",
  roll_number: "GJ11004571",
  application_number: "240310533399",
  candidate_name: "Aryan Sanjay Singh",
  father_name: "Sanjay Singh",
  date_of_birth: "20-11-2005",
  exam_date: "31-01-2024",
  city: "Surat"
};

canonicalizeAndHash(input).then(hash => {

  console.log("\n--- HASH GENERATED ---");
  console.log(hash);

});