<script lang="ts">
    import { location, querystring } from 'svelte-spa-router'
    import { onMount } from 'svelte';
    
    import SingleRecord from './SingleRecord.svelte';
    import Table from './Table.svelte';

    // Placeholder variable for svelte-spa-router
    export let params : any = {};

    // TODO: Encapsulate this nicely
    let project : any = null;
    let page : any  = null;

    // Base URL, make this application level somehow
    const baseUrl = 'http://localhost:3000';

    onMount(async() => {
        const response = await fetch(`${baseUrl}/${params.project}`);
        project = await response.json();
        page = project.pages.find(p => p.id == params.page);

        if(!page) {
            // SET ERROR
        }
    });

    async function getDataFor(entity) {
        const fetchUrl = `${baseUrl}/${params.project}/${entity.dataSourceId}${$querystring ? '?' + $querystring : ''}`;
        console.log(fetchUrl);
        const response = await fetch(fetchUrl);
        return await response.json();
    }
</script>

{#if project && page }
    <h1>{project.title}</h1>
    <h2>{page.id}</h2>

    {#each page.entities as entity }
    <p>
        {#if entity.type == 'table'}
            <Table data={getDataFor(entity)} tableEntity={entity}/>
        {:else if entity.type == 'singleRecord'}
            <SingleRecord data={getDataFor(entity)}/>
        {:else}
            NONE
        {/if}
    </p>
    {/each}


    <div class="collapse">
        <input type="checkbox" id="collapse-section1" aria-hidden="true">
        <label for="collapse-section1" aria-hidden="true">View Project JSON</label>
        <div>
            <pre>
                {JSON.stringify(project, null, 2)}
            </pre>
        </div>
    </div>

{/if}



<p>The current page is: {$location}</p>
<p>Params {params.project} / {params.page} </p>
