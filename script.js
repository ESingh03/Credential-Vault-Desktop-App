const serverURL = 'https://credential-vault.mywire.org';
var option = "Autofill";
const loginButton = document.getElementById('loginButton');
const autofill_option = document.getElementById('autofill_option');
const gen_pass = document.getElementById('gen_pass');
const errorContainer = document.getElementById('Error');
const messageContainer = document.getElementById('Message');


// Setting some UI design Logic As Well
autofill_option.addEventListener('click', function () {
    option = "Autofill";
    autofill_option.classList.add("selected")
    gen_pass.classList.remove("selected")
});
gen_pass.addEventListener('click', function () {
    option = "Generate";
    gen_pass.classList.add("selected")
    autofill_option.classList.remove("selected")
});


loginButton.addEventListener('click', async function () {
    errorContainer.innerHTML = "";
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await verify(username, password);
});

function verify(username, password) {
    // Send user credentials to the backend for verification

    fetch(serverURL + "/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            console.log(data);
            if (data.error === "Invaild") {
                errorContainer.innerHTML = "Incorrect Username Or Password";
            }
            else {
                if (data.msg === "Success") {
                    await send_request(username, password);
                    document.getElementById("option").style.display = "none";
                    document.getElementById("popup-content").style.display = "none";

                    messageContainer.innerHTML = "Success!<br>Waiting for response from mobile";
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);

            errorContainer.innerHTML = "Unable to connect to Server<br>Try Again";
        });
}


function send_request(username, password) {
    const mainDomain = "all";

    fetch(serverURL + "/recieve_request", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: option, username: username, password: password, domain: mainDomain }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.msg === "Timeout") {
                console.log("Timeout");

                messageContainer.innerHTML = "Timeout!";
            }
            else if (data.msg === "No Records Found" || data.msg === "Denied") {
                console.log(1);

                messageContainer.innerHTML = data.msg;
            }

            else {
                display_cred(data);

            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageContainer.innerHTML = "Unable to send request<br>Try Again";
        });
}
function display_cred(data){
    document.getElementById("popup-content").style.display = "flex";
    //document.getElementById("domain").innerHTML=data.domain;
    document.getElementById('username').value=data.username;
    document.getElementById('password').value=data.password;
    messageContainer.innerHTML="";
    loginButton.style.display="none";
    
}

function copy(element) {
    // Get the text field
    var copyText = document.getElementById(element);
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    if(element==="username"){
        document.getElementById("copybutton_username").innerHTML="Copied!";
        document.getElementById("copybutton_password").innerHTML="Copy";
    }
    else{
        document.getElementById("copybutton_username").innerHTML="Copy";
        document.getElementById("copybutton_password").innerHTML="Copied!";
    }
  }