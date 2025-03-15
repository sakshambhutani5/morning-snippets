import { API_KEY, RAPIDAPI_KEY } from './config.js';

const SOURCES = "venturebeat.com,techcrunch.com,wired.com,arxiv.org,towardsdatascience.com,syncedreview.com,ai.googleblog.com,nytimes.com,bbc.com,forbes.com,bloomberg.com,reuters.com";
const TLDR_API_URL = "https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize-url";

async function fetchLatestSnippet() {
    try {
        const response = await fetch(`https://gnews.io/api/v4/search?q=Artificial+Intelligence&in=${SOURCES}&lang=en&token=${API_KEY}`);
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            throw new Error("No news articles found.");
        }

        // Sort articles by latest first
        const sortedArticles = data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Pick the latest article
        const latestArticle = sortedArticles[0];
        const articleUrl = latestArticle.url;

        // Fetch summary from TLDRThis
        const summary = await summarizeWithTldrThis(articleUrl);

        // Display the snippet
        document.getElementById("snippet-text").textContent = summary;
        document.getElementById("snippet-source").innerHTML = 
            `Source: <a href="${articleUrl}" target="_blank">${latestArticle.source.name}</a>`;
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("snippet-text").textContent = "Failed to load snippets.";
    }
}

// Function to fetch summarized content from TLDRThis API
async function summarizeWithTldrThis(url) {
    try {
        const response = await fetch(TLDR_API_URL, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,  // Your RapidAPI key
                "X-RapidAPI-Host": "tldrthis.p.rapidapi.com"
            },
            body: JSON.stringify({ url: url, num_sentences: 3 })  // Adjust summary length
        });

        const data = await response.json();
        return data.summary || "Summary not available";
    } catch (error) {
        console.error("Error fetching summary:", error);
        return "Summary not available";
    }
}

// Initialize
updateDateTime();
fetchLatestSnippet();

// Event listener for "Next Snippet"
document.getElementById("next-btn").addEventListener("click", fetchLatestSnippet);
