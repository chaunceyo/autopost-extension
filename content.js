const tweetButton = document.createElement('button');
tweetButton.innerText = 'Post to Twitter';
tweetButton.style.position = 'fixed';
tweetButton.style.top = '10px';
tweetButton.style.right = '10px';
tweetButton.style.zIndex = '9999';
tweetButton.style.padding = '10px';
tweetButton.style.backgroundColor = '#1DA1F2';
tweetButton.style.color = '#fff';
tweetButton.style.border = 'none';
tweetButton.style.borderRadius = '5px';
tweetButton.style.cursor = 'pointer';

// Append the button to the body of the page
document.body.appendChild(tweetButton);

// When the button is clicked, send the current page's title and URL to the background script
tweetButton.addEventListener('click', () => {
  const pageTitle = document.title;
  const pageUrl = window.location.href;

  // Send the page title and URL to the background script to post the tweet
  chrome.runtime.sendMessage({
    action: 'postTweet',
    title: pageTitle,
    url: pageUrl
  });
});