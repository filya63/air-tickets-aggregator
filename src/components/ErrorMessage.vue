<template>
  <div class="error">{{ errorMessage }}</div>
</template>

<script>
export default {
    props: {
        errorMessage: {
            type: String,
            default: () => '',
        }
    }
}
</script>

<style>
    .error {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
</style>
