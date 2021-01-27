<script>
import TopMenu from "./Components/TopMenu.svelte";
import { onMount } from 'svelte';

let _GET = {};


let args = window.location.search.substr(1).split("&");
for (var i=0; i<args.length; ++i) {
    var tmp = args[i].split(/=/);
    if (tmp[0] != "") {
        _GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
    }
}

let cardSets;
let position = 0;

let flipCard = false;
let loading = false;

let cards;
function urlencoded(fetchData){
    let formBody = [];
    for (let k in fetchData) {
        formBody.push(encodeURIComponent(k) + "=" + encodeURIComponent(fetchData[k]));
    }
    formBody = formBody.join("&");
    return formBody;
}



onMount(async () => {
    let formData;
    if (sessionStorage.getItem("token") !== null){
        formData = await urlencoded({"token":sessionStorage.getItem("token"), 'id':_GET.id});
    }else{
        window.location.href = "/auth";
    }
    const res = await fetch("/api/loadset", {
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
    loading = true;
    cards = cardSets.sets.cards;
    console.log(cardSets);
});

const keyClick = (event)=>{
    if(event.keyCode === 32) {
        event.preventDefault();
        flipCard = !flipCard;
    }if(event.keyCode === 39) {
        event.preventDefault();
        if(position<cards.length-1)position++
    }if(event.keyCode === 37) {
        event.preventDefault();
        if(position>0) position--
    }
}
</script>

<svelte:body on:keydown={keyClick} />

<div>
    <TopMenu />
    {#if loading}
    <div class=" max-w-sm mx-auto">
        <div class="w-96 h-96 shadow-2xl cursor-default flex items-center justify-center" on:click={()=>flipCard = !flipCard}>
            {#if !flipCard}
            <h1 class="text-5xl text-center">{cards[position].term}</h1>
            {:else}
            <h1 class="text-5xl text-center">{cards[position].def}</h1>
            {/if}
        </div>
        <div class="flex">
            <button class="text-5xl flex-none w-12 h-12 focus:outline-none" on:click={()=>{if(position>0) position--}}>&lt;</button>
            <progress class="flex-grow my-auto" value={(position+1)/cards.length}></progress>
            <button class="text-5xl flex-none w-12 h-12 focus:outline-none" on:click={()=>{if(position<cards.length-1)position++}}>&gt;</button>
        </div>
    </div>
    {/if}
</div>