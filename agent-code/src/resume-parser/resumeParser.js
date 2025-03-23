// filepath: c:\Users\diptu\Projects\Airtribe-hackathon-AI-Agent\agent-code\src\resume-parser\resumeParser.js
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const fs = require("fs"); // Import fs module

const router = express.Router(); // Create a router instance

const { callOpenAI } = require("../llmCaller");

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      return cb(new Error("Only .pdf files are allowed!"));
    }
    cb(null, true);
  },
});

// Endpoint to handle PDF upload and parsing
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const pdfBuffer =
      req.file.buffer || require("fs").readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    const prompt = `
You are an expert data extraction AI. Your task is to extract structured candidate information from the provided raw text.
Ensure accuracy, completeness, and correct classification of the data.
Format the extracted data as a JSON object.

### **Fields to Extract:**
- **Candidate Information**
  - candidate_id
  - full_name
  - email
  - phone_number
  - linkedin_url
  - github_url
  - resume_text
  - career_goal

- **Experience Details**
  - total_experience_years
  - avg_tenure_per_role
  - job_switch_frequency
  - career_progression_rate
  - career_progression_ratev2
  - industry_changes_count

- **Job History (Array of Jobs)**
  - company_name
  - job_title
  - industry
  - start_date (YYYY-MM-DD)
  - end_date (YYYY-MM-DD or "Present")
  - tenure_months
  - responsibilities (Array of key responsibilities)
  - achievements (Array of key achievements)
  - key_skills_used (Array of skills applied in this role)

- **Education (Array of Degrees)**
  - degree
  - university
  - start_year (YYYY)
  - end_year (YYYY or "Present")
  - gpa

- **Skills (Array of Skills)**
  - skill_category
  - first_used_year
  - years_of_experience
  - last_used_year
  - skill_proficiency
  - projects_using_skill_count

- **Certifications (Array of Certifications)**
  - cert_name
  - issuing_org
  - issue_date (YYYY-MM-DD)
  - expiry_date (YYYY-MM-DD or "None" if lifetime)

- **Projects (Array of Projects)**
  - project_title
  - description
  - tech_stack (Array of technologies used)
  - github_url

- **Preferences**
  - preferred_roles
  - preferred_industries
  - preferred_locations
  - remote_preference
  - notice_period_days
  - expected_salary
  - college_tier

### **Guidelines:**
1. Ensure correct classification of data into respective fields.
2. Convert dates into standard formats (YYYY-MM-DD or YYYY).
3. Return an **accurate and structured JSON output** with **arrays for multi-entry fields**.
4. Ignore irrelevant text.
5. If any field is missing, return \`"N/A"\` or \`null\` instead of skipping it.

### **Raw Candidate Data:**
${pdfData.text}

### **Output JSON Format Example:**
\`\`\`json
{
  "candidate_id": "12345",
  "full_name": "John Doe",
  "email": "johndoe@example.com",
  "phone_number": "+1234567890",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "resume_text": "Extensive experience in software engineering...",
  "career_goal": "To become a principal software engineer...",
  "total_experience_years": 7,
  "avg_tenure_per_role": 24,
  "job_switch_frequency": 3,
  "career_progression_rate": 1.5,
  "career_progression_ratev2": 2.0,
  "industry_changes_count": 2,
  "job_history": [
    {
      "company_name": "TechCorp",
      "job_title": "Software Engineer",
      "industry": "IT",
      "start_date": "2018-06-01",
      "end_date": "2022-08-31",
      "tenure_months": 50,
      "responsibilities": ["Developed APIs", "Led a team of 5 engineers"],
      "achievements": ["Optimized system performance by 30%"],
      "key_skills_used": ["JavaScript", "React", "Node.js"]
    }
  ],
  "education": [
    {
      "degree": "B.Tech Computer Science",
      "university": "XYZ University",
      "start_year": 2014,
      "end_year": 2018,
      "gpa": 3.8
    }
  ],
  "skills": [
    {
      "skill_category": "Programming",
      "first_used_year": 2015,
      "years_of_experience": 8,
      "last_used_year": 2024,
      "skill_proficiency": "Expert",
      "projects_using_skill_count": 10
    }
  ],
  "certifications": [
    {
      "cert_name": "AWS Certified Developer",
      "issuing_org": "Amazon",
      "issue_date": "2022-05-01",
      "expiry_date": "2025-05-01"
    }
  ],
  "projects": [
    {
      "project_title": "E-commerce Platform",
      "description": "Built a full-stack e-commerce platform...",
      "tech_stack": ["React", "Node.js", "MongoDB"],
      "github_url": "https://github.com/johndoe/ecommerce"
    }
  ],
  "preferences": {
    "preferred_roles": ["Software Engineer", "Tech Lead"],
    "preferred_industries": ["IT", "FinTech"],
    "preferred_locations": ["New York", "Remote"],
    "remote_preference": "Yes",
    "notice_period_days": 30,
    "expected_salary": "120000 USD",
    "college_tier": "Tier 1"
  }
}
\`\`\`
Ensure the response is strictly formatted as valid JSON.
`;

    const response = await callOpenAI(
      "You are an AI that extracts structured candidate data.",
      prompt
    );

    return response;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).send("Failed to parse PDF.");
  }
});

module.exports = router; // Export the router
