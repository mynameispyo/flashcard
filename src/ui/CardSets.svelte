<script>
import TopMenu from "./Components/TopMenu.svelte"

import { onMount } from 'svelte';

function urlencoded(fetchData){
    let formBody = [];
    for (let k in fetchData) {
        formBody.push(encodeURIComponent(k) + "=" + encodeURIComponent(fetchData[k]));
    }
    formBody = formBody.join("&");
    return formBody;
}



let cardSets = [];


onMount(async () => {
    let formData
    if (sessionStorage.getItem("token") !== null){
        formData = await urlencoded({"token":sessionStorage.getItem("token")});
    }else{
        window.location.href = "/auth";
    }
    const res = await fetch("/api/cardsets", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', 
        body: formData// body data type must match "Content-Type" header
    });
    cardSets = await res.json();
    if (cardSets.error !== "nil" && cardSets.error === "hide"){
        sessionStorage.removeItem("token");
        window.location.href = "/auth";
    }
});


async function createNewSet(){
    let formData
    if (sessionStorage.getItem("token") !== null){
        formData = await urlencoded({"token":sessionStorage.getItem("token")});
    }else{
        window.location.href = "/auth";
    }
    const res = await fetch("/api/newset", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', 
        body: formData// body data type must match "Content-Type" header
    });
    cardSets = await res.json();
    if (cardSets.error !== "nil" && cardSets.error === "hide"){
        sessionStorage.removeItem("token");
        window.location.href = "/auth";
    }
    window.location.reload(false);
}

</script>


<div class="h-screen">
    <TopMenu />
    <div class="grid grid-cols-3">
        <div class=" h-full">
            <button class="bg-blue-400 text-white rounded-sm p-3" on:click={createNewSet}>New</button>
        </div>
        <div class="col-span-2 h-full">
            <div class="w-full p-5">
                {#if cardSets !== []}
                    {#if cardSets.error === "nil"}
                        {#each cardSets.sets as sets}
                            <div class="shadow-lg grid grid-cols-3 w-full bg-gray-500 mb-5">
                                <div class=" col-span-2">
                                    <h1 class="text-3xl text-center">{sets.title}</h1>
                                    <p class="text-xl text-center">{sets.desc}</p>
                                </div>
                                <div class="grid grid-cols-2">
                                    <a class="text-3xl" href={"./study?id="+encodeURIComponent(sets.id)}>Study</a>
                                    <a class="text-3xl" href={"./edit?id="+encodeURIComponent(sets.id)}>Edit</a>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <p class="text-red-500">{cardSets.error}</p>
                    {/if}
                {:else}
                        <p>...loading</p>
                {/if}
            </div>
        </div>
    </div>

</div>