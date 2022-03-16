<template>
    <form class="transfer">
        <h2 class="transfer__title">Количество пересадок</h2>
        <label
            class="transfer__item"
            v-for="(transfer, key) in transfers"
            :key="key"
        >
            <input
                type="checkbox"
                @click="selectCheckbox(transfer)"
            > {{ transfer }}
        </label>
    </form>
</template>

<script>
import { SELECTED_TRANSFER } from '../constants';

export default {
    data() {
        return {
            transfers: ['Без пересадок', '1 пересадка', '2 пересадки', '3 пересадки'],
            selectedCheckboxs: [],
        };
    },
    methods: {
        selectCheckbox( currentCheckbox ) {
            const isCheckboxInSelected = this.selectedCheckboxs.includes( currentCheckbox );

            if( isCheckboxInSelected ) {
                this.selectedCheckboxs = this.selectedCheckboxs.filter(selectedCheckbox => selectedCheckbox !== currentCheckbox);
                this.$emit( SELECTED_TRANSFER, this.selectedCheckboxs );

                return;
            }

            this.selectedCheckboxs.push( currentCheckbox );
            this.$emit( SELECTED_TRANSFER, this.selectedCheckboxs );
        }
    }
}
</script>

<style lang="scss">
    .transfer {
        display: flex;
        flex-direction: column;
        background: white;
        margin-right: 20px;
        border-radius: 5px;
        padding: 20px 0 20px 0;
        &__title {
            margin-bottom: 20px;
            padding: 0 20px;
        }
        &__item {
            cursor: pointer;
            padding: 20px 20px;
            &>input {
                cursor: pointer;
            }
            &:hover {
                background: #F1FCFF;
            }
        }
    }
</style>
