document.getElementById('post-button').addEventListener('click', function() {
    const tweetText= document.getElementById('tweet-text').value;
    const scheduleTime = document.getElementById('schedule-time').value;

    if (tweetText && scheduleTime) {
        chrome,storage.sync.set({ tweetText, scheduleTime }, function() {
            alert("Post Scheduled!");
        });
    }
});