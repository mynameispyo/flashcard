<script>
import TopMenu from "./Components/TopMenu.svelte";
import DeleteMordal from "./Components/DeleteMordal.svelte";
import { onMount } from 'svelte';
let _GET = {};


let args = window.location.search.substr(1).split("&");
for (var i=0; i<args.length; ++i) {
    var tmp = args[i].split(/=/);
    if (tmp[0] != "") {
        _GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
    }
}


function urlencoded(fetchData){
    let formBody = [];
    for (let k in fetchData) {
        formBody.push(encodeURIComponent(k) + "=" + encodeURIComponent(fetchData[k]));
    }
    formBody = formBody.join("&");
    return formBody;
}


let cardSets = {};
let saveResult = {};
let showMoral = false;
let showMoral2 = false;
let selectDelete;

onMount(async () => {
    let formData
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
});


async function saveSet() {
    let formData
    if (sessionStorage.getItem("token") !== null){
        delete cardSets.sets._id
        formData = await urlencoded({"token":sessionStorage.getItem("token"), 'id':_GET.id, 'newsets':JSON.stringify(cardSets.sets)});
    }else{
        window.location.href = "/auth";
    }
    const res = await fetch("/api/saveset", {
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
    saveResult = await res.json();
    if (saveResult.error !== "nil" && saveResult.error === "hide"){
        sessionStorage.removeItem("token");
        window.location.href = "/auth";
    }
}

async function deleteSet() {
    let formData
    if (sessionStorage.getItem("token") !== null){
        formData = await urlencoded({"token":sessionStorage.getItem("token"), 'id':_GET.id});
    }else{
        window.location.href = "/auth";
    }
    const res = await fetch("/api/deleteset", {
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
    saveResult = await res.json();
    if (saveResult.error !== "nil" && saveResult.error === "hide"){
        sessionStorage.removeItem("token");
        window.location.href = "/auth";
    }
}

function poppop(arr, index){
    let out = []
    for(let i=0;i<arr.length;i++){
        if(i !== index){
            out.push(arr[i]);
        }
    }
    return out;
}
function deleteWord(e){
    if(e.detail.result ){
        cardSets.sets.cards = poppop(cardSets.sets.cards, selectDelete);
        console.log(selectDelete);
        console.log(cardSets.sets.cards);
    }
    showMoral = false;
}

function deleteSetMordal(e){
    if(e.detail.result ){
        deleteSet();
        window.location.href = "/cardsets";
    }
    showMoral2 = false;
}

function addWord(){
    cardSets.sets.cards[cardSets.sets.cards.length] = {"term":"","def":"","image":"nil", "highlight":false};
    console.log(cardSets.sets.cards);
}
</script>

<div>
    <TopMenu />
    <div class="bg-blue-100">
        {#if cardSets.error === "nil"}
            <p>Title:</p><input bind:value={cardSets.sets.title}>
            <p>Description:</p><input bind:value={cardSets.sets.desc}>
            {#each cardSets.sets.cards as card,i}
                <div>
                    <input bind:value={cardSets.sets.cards[i].term}>
                    <input bind:value={cardSets.sets.cards[i].def}>
                    <button on:click={()=>{showMoral = true;selectDelete=i}}>Delete</button>
                </div>
            {/each}
        {/if}
        <button on:click={saveSet}>Save</button>
        <button on:click={addWord}>Add</button>

        <button on:click={()=>showMoral2= true} class="p-3">Delete this set</button>
        {#if saveResult.error === "nil"}
            <p>{saveResult.message}</p>
        {/if}
    </div>
    {#if showMoral}
    <DeleteMordal on:accept={deleteWord}/>
    {/if}
    {#if showMoral2}
    <DeleteMordal on:accept={deleteSetMordal}/>
    {/if}
</div>

