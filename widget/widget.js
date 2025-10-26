//DO NOT REMOVE OR EDIT ANYTHING UNTIL THE 3 LINE COMMENT

//DOM
const textElt = document.querySelector('p');
const widgetDiv = document.querySelector('#widget');

let params = new URLSearchParams(window.location.search); //get params from url if any (embedded)
const root = document.documentElement; //to use css root variables

function setVarValue(variable, value) { //set css root variable value
    root.style.setProperty(`--${variable}`, value)
}

//form input reception
window.addEventListener('message', (event) => {
    if (event.data?.type === "settings") {
        applySettings(event.data.payload)
    }
})

//Embed handler
if (params.toString()) { //if embedded
    applySettings(Object.fromEntries(params)) //directly apply settings from URL
}

//
// BELOW IS WHAT YOU CAN EDIT (check comments)
//

function applySettings(params) {
    for (const key in params) {
        switch(key) { //EDIT TO YOUR LIKING: cases are for each setting that doesn't depend on a CSS variable
            case 'text': //change text if "text" param
                textElt.innerText = params[key]
                break //avoid doing the other cases
            case 'rounded':
                widgetDiv.classList.toggle('rounded', params[key]) //toggle the 'rounded' class depending on the rounded param value
                break
            default:
                setVarValue(key, params[key]) //change css variable value (mainly for colours)
        }
    }
    //ADD: call render function here if necessary
}