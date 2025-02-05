document.addEventListener('DOMContentLoaded', function () {
        const postButton = document.getElementById('post-button');
        const tweetText = document.getElementById('tweet-text');
        const scheduleTime = document.getElementById('schedule-time')

        postButton.addEventListener('click', function () {
            const tweetTextValue = tweetText.value;
            const scheduleTimeValue = scheduleTime.value

            if(tweetTextValue && scheduleTimeValue) {
                chrome.storage.sync.set({ tweetText: tweetTextValue, scheduleTime: scheduleTimeValue}, function () {
                    alert("Post Scheduled!");
                    console.log('Tweet Text Stored:', tweetText);
                });
            } else {
                alert("Please enter both tweet text and schedule time.")
            }
        });
});