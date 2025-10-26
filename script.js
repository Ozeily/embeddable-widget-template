//DOM
const form = document.querySelector('form'); //EDIT IF NECESSARY: select using IDs/classes if necessary
const preview = document.querySelector('iframe');
const copyBtn = document.querySelector('button');

preview.addEventListener('load', () => { //set default values from widget.css :root
    const iframeDoc = preview.contentDocument || preview.contentWindow.document;
    const cssVars = getComputedStyle(iframeDoc.documentElement);

    form.querySelectorAll('[name]').forEach(input => {
        const varName = '--' + input.name;
        const cssVarValue = cssVars.getPropertyValue(varName).trim();
        //EDIT IF NECESSARY: add input types that don't depend on CSS variables in the array
        if (!['checkbox', 'text', 'select-one'].includes(input.type)) { //select-one: select element (default value set in index.html)
            input.value = cssVarValue;
        }
    });
    sendSettings() //apply everything, including checkboxes & text (no diff for colours)
});

//DO NOT REMOVE OR EDIT ANYTHING BELOW, except lines 26 and 41, and lines 58 to 62
function cleanParams(params) { //remove unecessary params. non vital function, but cleaner to keep
    for (const key in params) {
        const value = params[key]

        if (value === null || value === undefined || typeof value === 'string' && value.trim() === "") { //remove last "|| ..." if you accept empty strings/spaces alone
            delete params[key] //delete all empty params
        }
    }
    return params
};

function sendSettings() { //send settings to widget
    const data = new FormData(form)
    let params = cleanParams(Object.fromEntries(data))
    form.querySelectorAll('input[type=checkbox]').forEach(cbox => { //add checkboxes values
        params[cbox.name] = cbox.checked;
    });

    //EDIT: change '*' to your domain name for security
    preview.contentWindow.postMessage({type: 'settings', payload: params}, '*') //send post msg to widget
}

//send settings whenever user enters input
form.addEventListener('input', () => { sendSettings() })

//url base for widget: website url + relative path to widget + ? to add params
function getBaseURL() { return window.location.origin + '/widget/widget.html?'}

//copy url function for button
window.copyURL = function() {
    const data = new FormData(form);
    let params = cleanParams(Object.fromEntries(data.entries())) //convert data to object + remove unecessary params

    const url = getBaseURL() + new URLSearchParams(params).toString(); //dynamic widget URL

    navigator.clipboard.writeText(url)
    .then(() => {  //EDIT TO YOUR LIKING
        copyBtn.innerText = 'Copied!' //display 'Copied!' on the button for 2s
        setTimeout(() => { copyBtn.innerText = 'Copy URL' }, 2000)
    })
    .catch(err => { alert('Error: ' + err)})
}