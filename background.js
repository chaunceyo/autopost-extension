const API_KEY = 'sjzPDKtV1qjeHine53PG3Nu9W'
const API_SECRET_KEY = 'TQQB5YQPkrMhjrLY2oortYKfeQ51SbYQibbYTC4YIIii7bLNj9'
const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const OAUTH_CALLBACK = 'https://hkkfpnicfbjjefmhhfpgnpidillminbb.chromiumapp.org/'

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
            console.log('Tweet posted:', data);
            alert('Tweet posted successfully!');
        })
        .catch(error => {
            console.error('Error posting tweet:', error);
            alert('There was an error posting your tweet.');
        });
    });
}