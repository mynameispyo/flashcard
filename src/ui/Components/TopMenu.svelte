<script>
    let homePath = "/";
    if(sessionStorage.getItem("token")===null){
        homePath = "/home";
    }

    let togglebutton = true;
</script>

<div class="bg-blue-500 text-white md:flex md:justify-between md:items-center">

    <div class="flex items-center justify-between p-4">
        <a href={homePath}>Flashcard.Page</a>

        <button class="md:hidden" on:click={() => togglebutton = !togglebutton}>
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
            </svg>
        </button>
    </div>


    <ul class="flex flex-col bg-gray-700 px-4 py-2 md:flex md:flex-row md:bg-transparent {togglebutton ? 'hidden' : ''}">
        <a class="md:pl-2 md:pr-4" href="/cardsets">Study Sets</a>
        <a class="md:px-4" href="/auth">Account</a>
    </ul>
    
</div>