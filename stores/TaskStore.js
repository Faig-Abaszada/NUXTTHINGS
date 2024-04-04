import { defineStore } from "pinia";    

export const useTaskStore = defineStore('TaskStore', {
    state: () => ({
        tasks: [
            { id: 1, title: 'Task 1', isFav: false },
            { id: 2, title: 'Task 2', isFav: true },
        ]
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
    }
});