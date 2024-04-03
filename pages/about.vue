<template>
    <div>
        <h1>About Page</h1>
        <p>Welcome to the about page!</p>
        {{ name }}
        <input type="text" v-model="name" />
    </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import {useUserStore} from '@/stores/user';
export default {
    name: 'About',
    
    // Add your component's logic here
    data() {
        return {
            test: 'Hello, world!'   
        };
    },
    computed: {
        ...mapWritableState(useUserStore, ['name', ])
    },
    mounted() {
        console.log(this.test);
    }
}
</script>

<style scoped>
/* Add your component's styles here */
</style>