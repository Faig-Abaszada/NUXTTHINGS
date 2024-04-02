<template>
    <div>
        <h1>Product details for {{ $route.params.id }}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Your data properties here
            test: 'Hello, world!',
        };
    },
    mounted() {
        console.log(this.test);
        console.log(this.$route.params.id);
        // Code to run when the component is mounted
    },
    // Other lifecycle hooks and component options here
};
</script>

<style scoped>
/* Your component-specific styles here */
</style>