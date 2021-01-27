<script >
import TopMenu from "./Components/TopMenu.svelte";

let user;
let pass;
let result;

let show = false;
function urlencoded(fetchData){
    let formBody = [];
    for (let k in fetchData) {
        formBody.push(encodeURIComponent(k) + "=" + encodeURIComponent(fetchData[k]));
    }
    formBody = formBody.join("&");
    return formBody;
}


async function login(){
    let fetchData = {
        user:user,
        pass:pass,
    }

    let formBody = await urlencoded(fetchData);
    const res = await fetch("/api/login", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body:formBody // body data type must match "Content-Type" header
    });
    const data = await res.json();
    sessionStorage.setItem('token',data.token);

    result = data;
    show = true;
    
    if(data.error === "nil"){
        window.location.href = "/cardsets";
    }
    return data;
}

async function signup(){
    let fetchData = {
        user:user,
        pass:pass,
    }

    let formBody = await urlencoded(fetchData);
    const res = await fetch("/api/signup", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body:formBody // body data type must match "Content-Type" header
    });
    const data = await res.json();
    sessionStorage.setItem('token',data.token); 

    result = data;
    show = true;

    if(data.error === "nil"){
        window.location.href = "/home";
    }
    return data;
}

function logOut(){
    sessionStorage.removeItem("token");
    window.location.reload(false);
}
</script>
<TopMenu />
<div class="bg-gray-100 ">
    {#if sessionStorage.getItem("token")===null}
        <input bind:value={user}>
        <input bind:value={pass}>
        <button on:click={login}>Login</button>
        <button on:click={signup}>SignUp</button>
        <p>
            {#if show  }
                {result.message}
            {/if}
        </p>
    {:else}
        <button on:click={logOut}>LogOut</button>
    {/if}
</div> 