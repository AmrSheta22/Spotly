// wait to receive a message from the content script
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    // wait to receive a message from the content script
    if (request.message === 'highlight') {
        // if the message is 'highlight'
        // get page url and send it to the content script
        chrome.tabs.query({active: true},  function(tab) {
            // get page url's html
            var url =  tab[0].url;
            // send it to the content script
            // excute excute.js to manipulate the dom of the tab 
            console.log("sent to content script");
            // put url in chrome storage
            chrome.storage.sync.set({'slider': request.slid},  function() {
                // put url in chrome storage
                console.log('Value is set to ' + request.slid);
            });

            chrome.scripting.executeScript({
                target: {tabId: tab[0].id},
                files: ['excute.js']
            }).then(async () => {
                Promise.resolve().then(async () => {
                    const s = await sendResponse({message: 'hi'});
                }
                );

            });
    });

    }
    if (request.message === 'paragraphs') {
        // if the message is 'paragraphs'
        sendResponse({message: 'paragraphs received'});
    }
    return true;
});


