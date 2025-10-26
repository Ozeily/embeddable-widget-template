//DOM
const form = document.querySelector('form');
const preview = document.querySelector('iframe');
const copyBtn = document.querySelector('button');

function cleanParams(params) { //remove unecessary params
    for (const key in params) {
        const value = params[key]

        if (value === null || value === undefined || typeof value === 'string' && value.trim() === "") {
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

    preview.contentWindow.postMessage({type: 'settings', payload: params}, '*') //send post msg to widget
}

preview.addEventListener('load', () => { //set default values from widget.css :root
    const iframeDoc = preview.contentDocument || preview.contentWindow.document;
    const cssVars = getComputedStyle(iframeDoc.documentElement);

    form.querySelectorAll('[name]').forEach(input => {
        const varName = '--' + input.name;
        const cssVarValue = cssVars.getPropertyValue(varName).trim();
        if (!['checkbox', 'text', 'select-one'].includes(input.type)) { //if in the array, there isn't input.type
            input.value = cssVarValue;
        }
    });
    sendSettings() //apply everything, including cboxes & text (no diff for colours)
});

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
    .then(() => { //display 'Copied!' on the button for 2s
        copyBtn.innerText = 'Copied!'
        setTimeout(() => { copyBtn.innerText = 'Copy URL' }, 2000)
    })
    .catch(err => { alert('Error: ' + err)})
}