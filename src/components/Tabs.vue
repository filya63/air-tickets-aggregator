<template>
    <nav class="tabs">
        <button
            :class="{ active: isTabLowCost }"
            class="tabs__item"
            @click="onClickLowCostTickets"
        >
            Самый дешевый
        </button>
        <button
            :class="{ active: isTabFast }"
            class="tabs__item"
            @click="onClickFastTickets"
        >
            Самый быстрый
        </button>
    </nav>
</template>

<script>
import { CHANGE_ACTIVE_TAB_EVENT } from '../constants';

export default {
    data() {
        return {
            activeTab: null,
        };
    },

    methods: {
        onClickLowCostTickets() {
            if( this.activeTab === 'tab-low-cost' ) {
                this.activeTab = null;
            } else {
                this.activeTab = 'tab-low-cost';
            }

            this.$emit( CHANGE_ACTIVE_TAB_EVENT, this.activeTab );
        },

        onClickFastTickets() {
            if( this.activeTab === 'tab-fast' ) {
                this.activeTab = null;
            } else {
                this.activeTab = 'tab-fast';
            }

            this.$emit( CHANGE_ACTIVE_TAB_EVENT, this.activeTab );
        },
    },

    computed: {
        isTabLowCost() {
            return this.activeTab === 'tab-low-cost';
        },

        isTabFast() {
            return this.activeTab === 'tab-fast';
        },
    },
};
</script>

<style lang="scss">
    .tabs {
        &__item {
            height: 50px;
            width: calc(50% - 1px);
            background: white;
            border-radius: 5px 0 0 5px;
            padding: 0 20px;
            font-family: 'Open Sans';
            color: #4A4A4A;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            border: 1px solid #DFE5EC;
            &:last-child {
                border-radius: 0 5px 5px 0;
            }
        }
    }
    
    .active {
        color: white;
        background: #2196F3;
        border: 1px solid transparent;
    }
</style>
