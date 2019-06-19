<template>
    <component v-bind:is="category"></component>
</template>

<script>
import DockerfilePull from './DockerfilePull';

    export default {
        name: "contents",
        components: {
            'dockerfile-pull': DockerfilePull,
        },
        data:
            function () {
                return {
                    'contents_name': ""
                }
        },
        props: {category: String}
    }
</script>

<style scoped>
</style>