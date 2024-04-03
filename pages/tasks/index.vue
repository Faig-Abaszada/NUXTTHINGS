<template>
    <div>
        <!-- Your component's template goes here -->
        <h1>Pinia Tasks</h1>
        <div class="task-list">
            <div v-for="task in tasks">
                <task-detail :task="task"/>
            </div>
        </div>
    </div>
</template>

<script>
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
        ...mapWritableState(useTaskStore, ['tasks', 'name', 'age'])
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