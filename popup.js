document.getElementById('post-button').addEventListener('click', function () {
        const tweetText = document.getElementById('tweet-text').value
        const scheduleTime = document.getElementById('schedule-time').value

       
        if(tweetText && scheduleTime) {
            chrome.storage.sync.set({ tweetText, scheduleTime }, function () {
                    console.log('Data saved to chrome.storage.sync');
                    alert("Post Scheduled!");
            });
        } else {
            alert("Please enter both tweet text and schedule time.")
        }
        
});