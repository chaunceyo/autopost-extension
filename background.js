const API_KEY = 'sjzPDKtV1qjeHine53PG3Nu9W'
const API_SECRET_KEY = 'TQQB5YQPkrMhjrLY2oortYKfeQ51SbYQibbYTC4YIIii7bLNj9'
const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const OAUTH_CALLBACK = 'https://your-extension-id.chromiumapp.org/'

function fetchRequestToken() {
    const oauthData = {
        method: 'POST',
        headers: {
            'Authorization' : getOAuthHeader('POST', REQUEST_TOKEN_URL, {}, null),
        },
    };

    fetch(REQUEST_TOKEN_URL + `?oauth_callback=${endcodeURIComponent(OAUTH_CALLBACK)}`, oauthData)
        .then(response => response.text())
        .then(responseText => {
            const params = new URLSearchParams(responseText);
            const oauthToken = params.get('oauth_token');
            const oauthTokenSecret = params.get('oauth_token_secret');

            if (oauthToken && oauthTokenSecret) {
                const authURL = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
                chrome.identify.launchWebAuthFlow({
                    url: authURL,
                    interactive: true
                }, function(redirectUrl) {
                    if (redirectUrl) {
                        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
                        const oauthVerifier = urlParams.get('oauth_verifier');
                        exchangeForAccessToken(oauthToken, oauthTokenSecret, oauthVerifier);
                    }
                });
            } else {
                console.error("Error: Missing oauth_token or oauth_token_secret");
            }
        })
        .catch(error => console.error('Error fetching request token', error))
}




// chrome.runtime.onInstalled.addListener(() => {
//     chrome.identity.getAuthToken({ interactive: true}, function(token) {
//         // Handle the token to authenticate API calls

//     });
//     schedulePost();
// });

// function schedulePost() {
//     chrome.storage.sync.get(['tweetText', 'scheduleTime'], function(data) {
//         const tweetText = data.tweetText;
//         const scheduleTime = new Date(data.scheduleTime);

//         if (new Date() >= scheduleTime) {
//             postToTwitter(tweetText);
//         } else {
//             setTimeout(() => postToTwitter(tweetText), scheduleTime - new Date())
//         }
//     })
// }

// function postToTwitter(tweetText) {
//     const apiUrl = 1;

//     fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Access token HERE`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({status: tweetText})
//     })
//     .then(res => res.json())
//     .then(data => {
//         console.log('Tweet posted:', data);
//     })
//     .catch(err => {
//         console.error('Error posting tweet', err);
//     })
// }

// function authenticateWithTwitter() {
//     // OAuth 2.0 flow to authenticate the user and get a token
// }

