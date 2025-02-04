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