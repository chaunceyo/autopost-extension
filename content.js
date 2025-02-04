console.log("AutoPost Extension Content Script is running on Twitter");

if(window.location.href.includes('twitter.com/compose/tweet')) {
    const tweetTextArea = document.querySelector('div[aria-label="Tweet text"]');
    if(tweetTextArea) {
        tweetTextArea.innerText = "Automatically filled tweet from Chrome extension!";
    }
}