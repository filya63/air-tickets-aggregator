<template>
    <form class="transfer">
        <h2 class="transfer__title">Количество пересадок</h2>
        <label
            class="transfer__item"
            v-for="( transfer, key ) in transfers"
            :key="key"
        >
            <input
                class="transfer__item_checkbox"
                type="checkbox"
                @click="selectCheckbox( transfer )"
            >
            <span class="transfer__item_text">
                {{ transfer }}
            </span>
        </label>
    </form>
</template>

<script>
import { SELECTED_TRANSFER } from '../constants';

export default {
    data() {
        return {
            transfers: ['Без пересадок', '1 пересадка', '2 пересадки', '3 пересадки'],
            selectedTransfers: [],
        };
    },
    methods: {
        selectCheckbox( currentCheckbox ) {
            const isCheckboxInSelected = this.selectedTransfers.includes( currentCheckbox );

            if( isCheckboxInSelected ) {
                this.selectedTransfers = this.selectedTransfers.filter(selectedTransfer => selectedTransfer !== currentCheckbox);
                this.$emit( SELECTED_TRANSFER, this.selectedTransfers );

                return;
            }

            this.selectedTransfers.push( currentCheckbox );
            this.$emit( SELECTED_TRANSFER, this.selectedTransfers );
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
            display: flex;
            align-items: center;
            &_checkbox {
                position: absolute;
                z-index: -1;
                opacity: 0;
                &:checked+span::before {
                    border-color: #0b76ef;
                    background-color: #0b76ef;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
                }
                &+span {
                    display: inline-flex;
                    align-items: center;
                    user-select: none;
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 1em;
                        height: 1em;
                        flex-shrink: 0;
                        flex-grow: 0;
                        border: 1px solid #adb5bd;
                        border-radius: 0.25em;
                        margin-right: 0.5em;
                        background-repeat: no-repeat;
                        background-position: center center;
                        background-size: 50% 50%;
                    }
                }
            }
            &_text {
                margin-left: 10px;
            }
            &>input {
                cursor: pointer;
            }
            &:hover {
                background: #F1FCFF;
            }
        }
    }
</style>
