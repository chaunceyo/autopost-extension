chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getAuthToken({ interactive: true}, function(token) {
        // Handle the token to authenticate API calls

    });
    schedulePost();
});

function schedulePost() {
    chrome.storage.sync.get(['tweetText', 'scheduleTime'], function(data) {
        const tweetText = data.tweetText;
        const scheduleTime = new Date(data.scheduleTime);

        if (new Date() >= scheduleTime) {
            postToTwitter(tweetText);
        } else {
            setTimeout(() => postToTwitter(tweetText), scheduleTime - new Date())
        }
    })
}

function postToTwitter(tweetText) {
    const apiUrl = 1;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Access token HERE`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({status: tweetText})
    })
    .then(res => res.json())
    .then(data => {
        console.log('Tweet posted:', data);
    })
    .catch(err => {
        console.error('Error posting tweet', error);
    })
}

function authenticateWithTwitter() {
    // OAuth 2.0 flow to authenticate the user and get a token
}

