// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("AutoPost Extension Installed.");
    // On install, check if a tweet is scheduled
    chrome.storage.sync.get(['tweetText', 'scheduleTime'], function(result) {
        if (result.tweetText && result.scheduleTime) {
            console.log('Scheduled Tweet:', result.tweetText, result.scheduleTime);
            scheduleTweet(result.tweetText, result.scheduleTime);
        }
    });
});

// Function to schedule tweet based on stored schedule time
function scheduleTweet(tweetText, scheduleTime) {
    const now = new Date();
    const scheduleDate = new Date(scheduleTime); // Convert scheduleTime to a Date object
    
    if (now < scheduleDate) {
        // Calculate delay in milliseconds
        const delay = scheduleDate.getTime() - now.getTime();
        console.log(`Scheduling tweet for ${scheduleDate.toLocaleString()}`);
        
        // Set a timeout to post the tweet at the scheduled time
        setTimeout(function() {
            postTweet(tweetText); // Call function to post the tweet
        }, delay);
    } else {
        console.log("Scheduled time is in the past. Tweet won't be posted.");
    }
}

// Function to post the tweet using Twitter's API
function postTweet(tweetText) {
    console.log("Posting tweet:", tweetText);

    // OAuth setup
    const oauth = new OAuth({
        consumer: { key: 'your-consumer-key', secret: 'your-consumer-secret' },
        signature_method: 'HMAC-SHA1',
        hash_function: (base_string, key) => CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64)
    });

    const request_data = {
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        method: 'POST',
        data: { status: tweetText }
    };

    // Replace with user's OAuth tokens
    const token = {
        key: 'user-access-token',
        secret: 'user-access-token-secret'
    };

    // Send OAuth POST request to Twitter API
    oauth.post(request_data, token, function(error, response) {
        if (error) {
            console.error('Error posting tweet:', error);
        } else {
            console.log('Tweet posted successfully:', response);
        }
    });
}

// Handle changes in tweetText and scheduleTime storage
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === 'sync' && changes.tweetText || changes.scheduleTime) {
        const tweetText = changes.tweetText ? changes.tweetText.newValue : null;
        const scheduleTime = changes.scheduleTime ? changes.scheduleTime.newValue : null;

        if (tweetText && scheduleTime) {
            console.log("New scheduled tweet:", tweetText, scheduleTime);
            scheduleTweet(tweetText, scheduleTime);
        }
    }
});
