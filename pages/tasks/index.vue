<template>
    <div>
        <!-- Your component's template goes here -->
        <h1>Pinia Tasks</h1>
        <div class="task-list">
            <div v-for="task in tasks">
                <task-detail :task="task"/>
            </div>
        </div>
        <h2>Getters</h2>
        <div class="task-list">
            <div v-for="task in favs">
                <task-detail :task="task"/>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapState } from 'pinia'
import { mapWritableState } from 'pinia'; 
import { useTaskStore} from '@/stores/TaskStore';
  


export default {
    name: 'Tasks',
    data() {
        return {
            // Your component's data goes here
        };
    },
    computed: {
        // favs getterdir amma adlarini standart qoymaq lazimdiki qarishmasin
        ...mapWritableState(useTaskStore, ['tasks', 'favs']),
        // for use getter or read only things
        // ...mapState(useTaskStore, ['favs'])
    },
    methods: {
        // Your component's methods go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped>
/* Your component's styles go here */
</style>