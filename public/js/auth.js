function handleCredentialResponse(response) {

    const body = { id_token: response.credential }

    //Google ID token
    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
           'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( resp => resp.json())
    .then( ({token}) => {
        localStorage.setItem('token', token);
        window.location = 'chat.html';
      
    })
    .catch(console.warn)
   
  
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done=>{
        localStorage.clear();
        location.reload();
    });
}


/*---------Funcion para login by email-------*/

const miFormulario =  document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/login'
    : 'http://urlloginserver' ;


miFormulario.addEventListener('submit', ev=> {
    ev.preventDefault();
    const formData = {}; 

    for(let el of miFormulario.elements){
        if(el.name.length > 0){
            formData[el.name] = el.value;
        }
    }

    console.log(formData);
   
    fetch(url, {
        method: 'POST',
        headers: {
           'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then( resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.log(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
      
    })
    .catch(err => {
        console.log(err);
    })
   

});
