
if(typeof init === 'undefined'){
    const init = function(){
    // access the paragraphs staticly
    
    var para_html = get_paragraphs();
    // filter the paragraphs
    filtered = [];
    console.log(para_html.length)
    // get slider value from chrome storage
    chrome.storage.sync.get(['slider'], function(result) {
        console.log('Value currently is ' + result.slider + ' and type is ' + typeof result.slider);
        for (k = 0; k < para_html.length; k++) {
            filtered.push(filter_paragraphs(para_html[k]))
        }
        let promises = [];
        for (let i = 0; i < filtered.length; i++) {
            // catch error if the code below fails
            promises.push(fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: filtered[i],
                    threshold: parseInt(result.slider)
                    })
                }));
            }
        Promise.all(promises).then(async function(res) {
            let data = await Promise.all(res.map(r => r.json()));
            for (let i = 0; i < data.length; i++) {
                document.querySelectorAll('p')[i].innerHTML = await process_paragraphs(data[i], para_html[i]);
            }
            chrome.runtime.sendMessage({message: "done"});
        });
    });

}
init();
}
function getInnerHTML(element) {
    return element.innerHTML;
}
function highlight_by_index(inner_html, index) {
    // highlight the paragraph by index
    if (typeof inner_html === 'undefined') {
        return;
    }
    else {
    mark_startingtag = "<mark>"
    mark_endingtag = "</mark>"
    // add mark tag to the innerHTML of the 
    before = inner_html.slice(0, index[0]);
    highlighted = inner_html.slice(index[0], index[1]);
    after = inner_html.slice(index[1], inner_html.length);
    inner_html = before + mark_startingtag + highlighted + mark_endingtag + after;
    return inner_html;
    }
}
function test_sentence(text) {
    const test = document.createElement('div');
    test.innerHTML = text;
    document.body.appendChild(test);
}
// gets paragraphs of all the text on the page
function get_paragraphs() {
    var para_html = [];
    for (i = 0; i < document.querySelectorAll('p').length; i++) {
        para_html.push(document.querySelectorAll('p')[i].innerText);
    }
    return para_html;
}


// add all highlighting marks to the paragraph
function process_paragraphs(data, text) {
    if (data.length === 0) {
        return text;
    }
    inc = 0;
    for (i = 0; i < data.length; i++) {
        x = [data[i][0] + inc, data[i][1] + inc];
        text = highlight_by_index(text, [data[i][0]+inc, data[i][1]+inc]);
        inc +=13;
    }
    return text;
}


// returns the filtered by html of the paragraph
function filter_paragraphs(para_html) {
    // remove the paragraphs that are too short
    console.log("hi 115")
    if (para_html.length < 3) {
        return [para_html];
    }
    // divide the paragraphs that are too long into several paragraphs
    else if (para_html.length > 1000) {
        // search for nearest punctuation then divide the paragraph
        listed_paragraphs = split_on_long(para_html);
        console.log(listed_paragraphs)
        console.log(typeof split_longer(listed_paragraphs) != "boolean")
        if (typeof split_longer(listed_paragraphs) != "boolean") {
            while (typeof split_longer(listed_paragraphs) != "boolean") {
                listed_paragraphs.push(split_longer(listed_paragraphs));
            }
            return listed_paragraphs;
        }
        else {
            console.log("hi 129")
            return listed_paragraphs;
        }
    }
    else {
        return [para_html];
    }

}
function split_on_long(para_html) {
    var point;
    var flag = true;
    for (i = 1000; i > 900; i--) {
        if (para_html[i] == "." || para_html[i] == "?" || para_html[i] == "!") {
            point = i;
            flag = false;
            break;
        }
    }
    if (flag) {
        point = 390;
    }
    return [para_html.slice(0, point), para_html.slice(point, para_html.length)];
}
function split_longer(listed_paragraphs) {
    if (listed_paragraphs[listed_paragraphs.length-1 > 1000]) {
        new_value =  split_on_long(listed_paragraphs[listed_paragraphs.length-1]);
        return new_value[1];
    }
    else {
        return false;
    }
}