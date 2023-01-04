<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "LoginForm",
    data() { 
        return {
            instance: 'https://hachyderm.io',
            oauth: '',
            remember: false,
        }
    }
});
</script>

<template>
<form @submit.prevent="$emit('login',instance,oauth,remember)">
<div class="aligned">
    <label for="instance">Instance:</label>
    <input type="url" v-model="instance" id="instance" required>
</div>
<div class="aligned">
    <label for="oauth">Token:</label>
    <input type="text" v-model="oauth" id="oauth" required>
</div>
<div class="commit">
    <button type="submit">Log in</button>
    <input type="checkbox" v-model="remember" id="remember"/>
    <label for="remember">Remember</label>
</div>
</form>
</template>

<style scoped>
form {
    display: flex;
    flex-direction: row;
}
@media (max-width: 800px) {
    form {
        flex-direction: column;
    }
}
form > div {
    display: flex;
    flex-direction: row;
    margin: 0.1em;
}
label {
    margin-right: 0.2em;
}
button {
    min-width: fit-content;
}
</style>