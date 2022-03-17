<template>
    <nav class="tabs">
        <button :class="isTabLowCost" class="tabs__item" @click="onClickLowCostTickets">Самый дешевый</button>
        <button :class="isTabFast" class="tabs__item" @click="onClickFastTickets">Самый быстрый</button>
    </nav>
</template>

<script>
import { CHANGE_ACTIVE_TAB_EVENT } from '../constants';

export default {
    data() {
        return {
            activeTab: null,
        }
    },
    methods: {
        onClickLowCostTickets() {
            if( this.activeTab === 'tab-low-cost' ) {
                this.activeTab = null;
                this.$emit( CHANGE_ACTIVE_TAB_EVENT, this.activeTab );

                return;
            }

            this.activeTab = 'tab-low-cost';
            this.$emit( CHANGE_ACTIVE_TAB_EVENT, this.activeTab );
        },
        onClickFastTickets() {
            if( this.activeTab === 'tab-fast' ) {
                this.activeTab = null;
                this.$emit( CHANGE_ACTIVE_TAB_EVENT, this.activeTab );

                return;
            }

            this.activeTab = 'tab-fast';
            this.$emit( CHANGE_ACTIVE_TAB_EVENT, this.activeTab );
        },
    },
    computed: {
        isTabLowCost() {
            return this.activeTab === 'tab-low-cost'
                ? 'active'
                : false
        },
        isTabFast() {
            return this.activeTab === 'tab-fast'
                ? 'active'
                : false
        },
    },
}
</script>

<style lang="scss">
    .tabs {
        margin-bottom: 20px;
        &__item {
            height: 50px;
            background: white;
            border-radius: 5px 0 0 5px;
            padding: 0 20px;
            font-family: 'Open Sans';
            color: #4A4A4A;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            &:last-child {
                border-radius: 0 5px 5px 0;
            }
        }
    }
    
    .active {
        color: white;
        background: #2196F3;
    }
</style>
