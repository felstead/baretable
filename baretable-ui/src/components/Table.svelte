<script lang="ts">
    export let tableEntity;
    export let data;
</script>

<h3>Table: {tableEntity.id}</h3>
{#await data}
    WAITING
{:then data}
    <p>Results {data.offset+1}-{data.offset+data.resultSetRecordCount} of {data.totalRecordCount}</p>
    <table>
        <thead>
            {#each data.schema as col }
            <th>{col.columnName}</th>
            {/each}
        </thead>
        <tbody>
            {#each data.results as row }
            <tr>
                {#each row as col, i }
                <td data-label="{data.schema[i].columnName}">{col}</td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
{:catch error}
    <p>ERROR: {error.message}</p>
{/await}
