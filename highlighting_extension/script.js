// load all dom of index.html first
document.addEventListener('DOMContentLoaded', async function() {
    // load all dom of index.html first
    // send message to background.js when click button
    document.getElementById('highlight').addEventListener('click', function() {
        // send message to background.js when click button
        var slider = document.getElementById("myRange");
        chrome.runtime.sendMessage({message: 'highlight', slid: slider.value} ,  function(response) {
            // send message to background.js when click button
            // create spinner button when click
            button = document.getElementById('highlight');
            button.disabled = true;
            // add loading spinner to button when click
            button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

            return true;
            // recieve response from background.js

        });
    });
});
// recieve response from background.js
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    // recieve response from background.js
    if (request.message === 'done') {
            // if the message is 'done'
            button.innerHTML = 'Done!';
            button.disabled = True;
        }
    return true;
});




function getInnerText(element) {
    // get the html of all p tags
    return element.innerHTML;
}