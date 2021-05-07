<script>
    import { onMount } from 'svelte'
    import { init } from './virtual-scroller'
    
    export let items = []
    export let options = {}
    export let renderSlot
    export let renderItem

    onMount(() => {
        const container = document.querySelector('[slot="container"]')
        init({ container, items, renderSlot, renderItem, options })
    })
</script>

<slot name="container"/>