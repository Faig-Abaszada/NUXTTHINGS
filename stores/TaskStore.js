import { defineStore } from "pinia";    

export const useTaskStore = defineStore('TaskStore', {
    state: () => ({
        tasks: [
            { id: 1, title: 'Task 1', isFav: false },
            { id: 2, title: 'Task 2', isFav: true },
        ],
        loading: false
    }),
    getters: {
        favs() {
            return this.tasks.filter(task => task.isFav);
        },
        favsCount() {
            return this.favs.length;
        }, 
        totalCount: (state) => {
            return state.tasks.length;
        }
    }, 
    actions: {
        async actionGetTasks() {
            this.loading = true;
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();

            // mutation is here
            this.tasks = data;
            this.loading = false;
        },
        async addTask(title) {
            const res = await fetch('jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify({ title, isFav: false }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }); 
            if (res.error) {
                console.log('Error:', res.error);
            }
        }
    }
});