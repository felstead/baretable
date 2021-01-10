<script lang="ts">
    import Router from 'svelte-spa-router';
    import Page from './components/Page.svelte';

    // Routers
    const routes = {
        '/:project/:page?': Page
    };
</script>

<Router {routes} />

<svelete:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</svelete:head>

