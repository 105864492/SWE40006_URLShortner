// Get elements from the HTML page
const shortenForm = document.getElementById("shortenForm");
const longLinkInput = document.getElementById("longLink");
const shortenButton = document.getElementById("shortenButton");
const resultDiv = document.getElementById("result");

// Backend API endpoint
const API_URL = "/api/urls";

// Listen for form submission
shortenForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear previous results
    resultDiv.replaceChildren();

    // Get the URL entered by the user
    const longUrl = longLinkInput.value.trim();

    // Validate the URL
    let parsedUrl;

    try {
        parsedUrl = new URL(longUrl);
    } catch {
        showMessage("Please enter a valid URL.", true);
        return;
    }

    // Only allow HTTP and HTTPS URLs
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        showMessage("Please enter an HTTP or HTTPS URL.", true);
        return;
    }

    // Show loading state
    shortenButton.disabled = true;
    shortenButton.textContent = "Shortening...";
    showMessage("Creating your short link...");

    try {
        // Send the URL to the backend
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                longUrl: parsedUrl.href
            })
        });

        // Read the API response
        const data = await response.json();

        // Handle errors returned by the backend
        if (!response.ok) {
            throw new Error(
                data.error || data.message ||
                "Unable to shorten the URL."
            );
        }

        // Check that the backend returned a short URL
        if (typeof data.shortUrl !== "string") {
            throw new Error("The server returned an invalid response.");
        }

        // Only display HTTP or HTTPS short URLs
        const shortUrl = new URL(data.shortUrl, window.location.origin);

        if (!["http:", "https:"].includes(shortUrl.protocol)) {
            throw new Error("The server returned an invalid URL.");
        }

        // Display the result safely
        resultDiv.replaceChildren();

        const message = document.createElement("p");
        message.textContent = "Your shortened URL is:";

        const link = document.createElement("a");
        link.href = shortUrl.href;
        link.textContent = shortUrl.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.textContent = "Copy link";

        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(shortUrl.href);
                copyButton.textContent = "Copied!";
            } catch {
                showMessage(
                    "Could not copy automatically. Select and copy the link.",
                    true
                );
            }
        });

        resultDiv.append(message, link, copyButton);

        // Clear the original input after success
        longLinkInput.value = "";

    } catch (error) {
        showMessage(
            error.message === "Failed to fetch"
                ? "Could not connect to the server. Please try again."
                : error.message || "An unexpected error occurred.",
            true
        );
    } finally {
        // Restore the button
        shortenButton.disabled = false;
        shortenButton.textContent = "Shorten Link";
    }
});

// Display status messages safely
function showMessage(message, isError = false) {
    resultDiv.replaceChildren();

    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.setAttribute("role", isError ? "alert" : "status");

    resultDiv.appendChild(paragraph);
}