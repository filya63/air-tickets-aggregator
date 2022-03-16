<template>
<div>
  <button @click="onClickLowCostTickets">Самый дешевый</button>
  <button @click="onClickFastTickets">Самый быстрый</button>
</div>
</template>

<script>
export default {
    methods: {
        onClickLowCostTickets() {
            this.$emit('click-tab-low-cost');
        },
        onClickFastTickets() {
            this.$emit('click-tab-fast');
        },
    }
}
</script>
