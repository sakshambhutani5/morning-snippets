// Function to summarize text (approx 50 words)
function summarizeText(text, wordLimit) {
    if (!text) return "No description available.";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
}
