<script setup lang="ts">
import Login from "./components/Login.vue"
import Editor from "./components/Editor.vue";
import mastodon_controller from "./lib/controller";
import { lifeCycle } from './lib/loginState'
import ScheduledPosts from "./components/ScheduledPosts.vue";
</script>

<template>
  <Login :controller="mastodon_controller" />
  <div v-if="lifeCycle.isLoggedIn()">
    <ScheduledPosts :controller="mastodon_controller" />
    <Editor :controller="mastodon_controller" />
  </div>
  <div v-else>
    <p><b>Welcome to the simple Mastodon post scheduler!</b></p>
    <p>Can you tell this was made by a backend engineer?</p>
    <p>The token can be obtained on your instance, in settings. Go to Development and click on New application.</p>
    <p><a href="https://github.com/HappyCerberus/mastodon-scheduler">GitHub repo</a></p>
  </div>
</template>

<style scoped>

</style>