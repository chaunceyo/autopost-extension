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