const { callOpenAI } = require("./llmCaller");

async function analyzeWithGPT(textContent) {
  try {
    const systemMessage =
      "Extract all technical keywords from the given text and provide their frequency count in JSON format.";

    const prompt = `
You are an expert data extraction AI. Your task is to extract structured job posting details from the provided raw text.
Ensure accuracy, completeness, and correct classification of the data.
Format the extracted data as a JSON object.

### **Fields to Extract:**
- **Job Information**
  - job_id
  - job_title
  - company_name
  - company_industry
  - job_location
  - job_type
  - remote_option
  - work_mode
  - job_description_raw

- **Job Posting Dates**
  - job_posting_date (YYYY-MM-DD)
  - job_expiry_date (YYYY-MM-DD)

- **Experience Requirements**
  - minimum_experience_years
  - maximum_experience_years
  - preferred_experience_years
  - industry_experience_required
  - preferred_previous_roles

- **Skills Requirements**
  - required_skills (Array of must-have skills)
  - optional_skills (Array of good-to-have skills)
  - skill_proficiency_required (Minimum proficiency level)
  - technical_skills (Array of technical skills)
  - soft_skills (Array of soft skills)

- **Education & Certifications**
  - minimum_education
  - preferred_education
  - required_certifications
  - preferred_certifications

- **Job Responsibilities & Expectations**
  - primary_responsibilities (Array of core duties)
  - expected_outcomes (Array of key deliverables)
  - day_to_day_tasks (Array of daily tasks)

- **Salary & Compensation**
  - salary_min (Minimum salary range)
  - salary_max (Maximum salary range)
  - compensation_type (Hourly, Monthly, or Yearly)
  - benefits (Array of perks and benefits)

- **Application Process**
  - application_deadline (YYYY-MM-DD)
  - application_method (Email, Online Portal, etc.)
  - application_link
  - contact_person_name
  - contact_email

- **Additional Requirements**
  - college_tier_minimum_requirement

### **Guidelines:**
1. Ensure correct classification of data into respective fields.
2. Convert dates into standard formats (YYYY-MM-DD).
3. Return an **accurate and structured JSON output** with **arrays for multi-entry fields**.
4. Ignore irrelevant text.
5. If any field is missing, return \`"N/A"\` or \`null\` instead of skipping it.

### **Raw Job Posting Data:**
${textContent}

### **Output JSON Format Example:**
\`\`\`json
{
  "job_id": "J12345",
  "job_title": "Senior Software Engineer",
  "company_name": "TechCorp",
  "company_industry": "IT",
  "job_location": "New York, USA",
  "job_type": "Full-time",
  "remote_option": "Yes",
  "work_mode": "Hybrid",
  "job_description_raw": "We are looking for a Senior Software Engineer with expertise in JavaScript and cloud technologies...",
  "job_posting_date": "2025-03-01",
  "job_expiry_date": "2025-04-01",
  "minimum_experience_years": 5,
  "maximum_experience_years": 10,
  "preferred_experience_years": 7,
  "industry_experience_required": "Software Development",
  "preferred_previous_roles": ["Software Engineer", "Tech Lead"],
  "required_skills": ["JavaScript", "React", "Node.js"],
  "optional_skills": ["AWS", "Docker"],
  "skill_proficiency_required": "Advanced",
  "technical_skills": ["JavaScript", "TypeScript", "Node.js", "React"],
  "soft_skills": ["Leadership", "Communication", "Problem-Solving"],
  "minimum_education": "Bachelor's in Computer Science",
  "preferred_education": "Master's in Computer Science",
  "required_certifications": ["AWS Certified Developer"],
  "preferred_certifications": ["Google Cloud Professional"],
  "primary_responsibilities": ["Develop scalable web applications", "Lead a team of developers"],
  "expected_outcomes": ["Deliver high-quality code", "Improve application performance"],
  "day_to_day_tasks": ["Writing code", "Code reviews", "Collaborating with team"],
  "salary_min": "120000 USD",
  "salary_max": "150000 USD",
  "compensation_type": "Yearly",
  "benefits": ["Health Insurance", "401(k)", "Stock Options"],
  "application_deadline": "2025-04-05",
  "application_method": "Online Portal",
  "application_link": "https://careers.techcorp.com/job12345",
  "contact_person_name": "Jane Doe",
  "contact_email": "jobs@techcorp.com",
  "college_tier_minimum_requirement": "Tier 1"
}
\`\`\`
Ensure the response is strictly formatted as valid JSON.
`;

    const response = await callOpenAI(
      "You are an AI that extracts structured job data from a resume.",
      prompt
    );

    console.log(response);

    return response;
  } catch (error) {
    console.error("Error analyzing text:", error.message);
    return null;
  }
}

module.exports = { analyzeWithGPT };
