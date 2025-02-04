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

function exchangeForAccessToken(oauthToken, oauthTokenSecret, oauthVerifier) {
    const params = new URLSearchParams({
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier
    });

    const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
    const oauthData = {
        method: 'POST',
        headers: {
            'Authorization': getOAutHeader('POST', ACCESS_TOKEN_URL, { oauth_token: oauthToken, oauth_verifier: oauthVerifier }, oauthTokenSecret),
        },
    };

    fetch(ACCESS_TOKEN_URL, oauthData)
        .then(response => response.text())
        .then(responseText => {
            const urlParams = new URLSearchParams(responseText);
            const oauthAccessToken = urlParams.get('oauth_token');
            const oauthAccessTokenSecret = urlParams.get('oauth_token_secret');

            chrome.storage.sync.set({ oauthAccessToken, oauthAccessTokenSecret }, function() {
                console.log('Access tokens stored!');
            });
        })
        .catch(error => console.error('Error exchanging for access token:', error));
}

function postTweet(tweetText) {
    chrome.storage.sync.get(['oauthAccessToken', 'oauthAccessTokenSecret'], function(data) {
        const { oauthAccessToken, oauthAccessTokenSecret } = data;

        if (!oauthAccessToken || !oauthAccessTokenSecret) {
            console.error('OAuth tokens are not found. Please authenticate first.');
            return;
        }

        const tweetData = { status: tweetText };
        const POST_TWEET_URL = 'https://api.twitter.com/1.1/statuses/update.json';

        const oauthData = {
            method: 'POST',
            headers: {
                'Authorization': getOAuthHeader('POST', POST_TWEET_URL, tweetData, oauthAccessTokenSecret),
            },
        };

        fetch(`${POST_TWEET_URL}?status=${encodeURIComponent(tweetText)}`, oauthData)
            .then(res => res.json())
            .then(data => {
                console.log('Tweet posted successfully:', data);
            })
            .catch(error => console.error('Error positng tweet:', error));
    });
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

