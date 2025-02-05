const API_KEY = 'sjzPDKtV1qjeHine53PG3Nu9W'
const API_SECRET_KEY = 'TQQB5YQPkrMhjrLY2oortYKfeQ51SbYQibbYTC4YIIii7bLNj9'
const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const OAUTH_CALLBACK = 'https://hkkfpnicfbjjefmhhfpgnpidillminbb.chromiumapp.org/'

function handleRateLimitError(response) {
    const resetTime = response.headers.get('x-rate-limit-reset');
    const currentTime = Math.floor(Date.now() / 1000);  // Get current timestamp

    const retryAfter = resetTime - currentTime; // Calculate seconds to wait

    console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);

    // Retry after waiting for the reset time
    setTimeout(() => {
        // Retry your request here (you can refactor this into a separate function)
        fetchTwitterAPI();
    }, retryAfter * 1000); // Convert to milliseconds
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("AutoPost Extension Installed.");

    chrome.action.onClicked.addListener(() => {
        authenticateWithTwitter();
    });
});

function authenticateWithTwitter() {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if(chrome.runtime.lastError || !token) {
            console.error("Authentication failed", chrome.runtime.lastError);
            return;
        }
        console.log("Authenticated with token:", token);

        fetchTwitterAPI(token)
    });
}

function fetchTwitterAPI(token) {
    const url = 'https://api.twitter.com/2/tweets';
    chrome.storage.sync.get(['tweetText', 'scheduleTime'], function(data) {
        const tweetData = {
            status: data.tweetText
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tweetData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                console.error('Error posting tweet:', data.errors);  // Log any errors from Twitter API
                alert('Error posting tweet.');
            } else {
                console.log('Tweet posted successfully:', data);  // Log success
                alert('Tweet posted successfully!');
            }
        })
        .catch(error => {
            console.error('Error posting tweet:', error);
            alert('There was an error posting your tweet.');
        });
    });
}