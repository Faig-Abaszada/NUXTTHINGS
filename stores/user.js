import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        // Define your state properties here
        name: 'ssssssssssss',
        age: 0,
        // ...
    }),

    getters: {
        testGetterData() {
            return this.$store.favs;
        }
        // Define your getters here
        // For example:
        // fullName() {
        //     return `${this.name} Doe`;
        // },
    },

    actions: {
        // Define your actions here
        // For example:
        setName(name) {
            this.name = name;
        },
        setAge(age) {
            this.age = age;
        },
    },
});