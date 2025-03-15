import { API_KEY } from './config.js';

const SOURCES = "venturebeat.com,techcrunch.com,wired.com,arxiv.org,towardsdatascience.com,syncedreview.com,ai.googleblog.com,nytimes.com,bbc.com,forbes.com,bloomberg.com,reuters.com";

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

        // Summarize content
        const summary = summarizeText(latestArticle.description || latestArticle.content, 50);

        // Display the snippet
        document.getElementById("snippet-text").textContent = summary;
        document.getElementById("snippet-source").innerHTML = 
            `Source: <a href="${latestArticle.url}" target="_blank">${latestArticle.source.name}</a>`;
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("snippet-text").textContent = "Failed to load snippets.";
    }
}

// Initialize
updateDateTime();
fetchLatestSnippet();

// Event listener for "Next Snippet"
document.getElementById("next-btn").addEventListener("click", fetchLatestSnippet);
