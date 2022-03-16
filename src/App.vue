<template>
    <main class="order">
        <aside class="order-aside">
            <FilterTransfer
                @selected-transfers="getTransfers"
            />
        </aside>
        <section>
            <Tabs />
            <Tickets
                :selected-transfers="selectedTransfers"
            />
        </section>
    </main>
</template>

<script>
import FilterTransfer from './components/FilterTransfer.vue';
import Tabs from './components/Tabs.vue';
import Tickets from './components/Tickets.vue';

export default {
    components: {
        FilterTransfer,
        Tabs,
        Tickets,
    },
    data() {
        return {
            selectedTransfers: [],
        }
    },
    methods: {
        getTransfers( selectedTransfers ) {
            this.selectedTransfers = selectedTransfers;
        }
    }
};
</script>

<style lang="scss">
    body {
        background-color: #F3F7FA;
        font-family: 'Open Sans';
        color: #4A4A4A;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    h2 {
        font-weight: 600;
    }

    .order {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        &-aside {
            height: 100%;
        }
    }
</style>
