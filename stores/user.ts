import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        // Define your state properties here
        name: 'ssssssssssss',
        age: 0,
        // ...
    }),

    getters: {
        // Define your getters here
        // For example:
        // fullName() {
        //     return `${this.name} Doe`;
        // },
    },

    actions: {
        // Define your actions here
        // For example:
        setName(name: string) {
            this.name = name;
        },
        setAge(age: number) {
            this.age = age;
        },
    },
});