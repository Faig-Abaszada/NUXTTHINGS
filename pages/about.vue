<template>
    <div>
        <h1>About Page</h1>
        <p>Welcome to the about page!</p>
    </div>
</template>

<script>
export default {
    name: 'About',
    
    // Add your component's logic here
    data() {
        return {
            test: 'Hello, world!'   
        };
    },
    mounted() {
        console.log(this.test);
    }
}
</script>

<style scoped>
/* Add your component's styles here */
</style>