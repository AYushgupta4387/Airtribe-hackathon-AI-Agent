function analyze() {
    // Get the job posting URL (if provided)
    const jobUrl = document.getElementById('url').value;

    // Get the uploaded resume file
    const resumeFile = document.getElementById('resumeFile').files[0];

    // Get the job description text
    const jobDescriptionText = document.getElementById('jobDescription').value.toLowerCase();

    // Check if a resume file is uploaded
    if (resumeFile) {
        // Read the resume file
        const reader = new FileReader();
        reader.onload = function (event) {
            const resumeText = event.target.result.toLowerCase();

            // Extract keywords from the job description
            const jobKeywords = extractKeywords(jobDescriptionText);

            // Find missing keywords in the resume
            const missingKeywords = jobKeywords.filter(keyword => !resumeText.includes(keyword));

            // Display results
            displayResults(missingKeywords);
        };
        reader.readAsText(resumeFile); // Read the file as text
    } else {
        alert("Please upload a resume file!");
    }
}

// Function to extract keywords from text
function extractKeywords(text) {
    // List of common words to ignore
    const commonWords = new Set(['the', 'and', 'of', 'in', 'to', 'a', 'for', 'with', 'on', 'at']);
    
    // Split the text into words and filter out common words
    const words = text.split(/\W+/).filter(word => word.length > 2 && !commonWords.has(word));
    
    // Remove duplicate words
    return [...new Set(words)];
}

// Function to display results
function displayResults(missingKeywords) {
    const missingKeywordsElement = document.getElementById('missingKeywords');
    const suggestionsElement = document.getElementById('suggestions');

    if (missingKeywords.length > 0) {
        missingKeywordsElement.innerHTML = `<strong>Missing Keywords:</strong> ${missingKeywords.join(', ')}`;
        suggestionsElement.innerHTML = `<strong>Suggestions:</strong> Consider adding these keywords to your resume: ${missingKeywords.join(', ')}.`;
    } else {
        missingKeywordsElement.innerHTML = "<strong>No missing keywords found!</strong>";
        suggestionsElement.innerHTML = "<strong>Your resume looks great for this job!</strong>";
    }
}