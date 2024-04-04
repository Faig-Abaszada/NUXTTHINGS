<template>
    <div>
        <h1>Pinia Tasks</h1>

        <button @click="addTask">Add Task</button>


        <div class="filters">
            <button @click="filter = 'all'">All</button>
            <button @click="filter = 'favs'">Favs</button>  
        </div>

        <div class="task-list" v-if="filter === 'all'">
            <p>Your have {{  totalCount  }} tasks left to do</p>
            <div v-for="task in tasks">
                <task-detail :task="task"/>
            </div>
        </div>
        
        <div class="task-list" v-if="filter === 'favs'">
            <p>Your have {{  favsCount  }} tasks left to do</p>
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
            filter: 'all',
        };
    },
    computed: {
        // favs getterdir amma adlarini standart qoymaq lazimdiki qarishmasin
        ...mapWritableState(useTaskStore, ['tasks', 'favs', 'favsCount', 'totalCount']),
        // for use getter or read only things
        // ...mapState(useTaskStore, ['favs'])
    },
    methods: {
       addTask() {
           this.tasks.push({
               title: 'New Task',
               fav: false,
           });
       }
    },
    mounted() {
        
    },
};
</script>

<style scoped>

</style>