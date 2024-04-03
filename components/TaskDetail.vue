<template>
    <div class="task">
        <h3>{{ task.title }}</h3>
        <div class="icons">
            <i class="material-icons">-</i>
            <i class="material-icons">(+)</i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TaskDetail',
    props: ['task'],
    data() {
        return {
            // Your component's data goes here
        };
    },
    methods: {
        // Your component's methods go here
    },
    computed: {
        // Your component's computed properties go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped>
.task {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.material-icons {
    margin-right: 20px;
}
</style>