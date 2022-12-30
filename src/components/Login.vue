<script lang="ts">
import { defineComponent } from 'vue'
import { MastodonController } from '../lib/controller'
import { lifeCycle, LifeCycle } from '../lib/loginState'

export default defineComponent({
  name: "Login",
  data() {
    return {
        instance: 'https://hachyderm.io',
        oauth: '',
        user: '',
        last_error: '',
        authenticated: lifeCycle,
    }
  },
  props: {
    controller: MastodonController
  },
  methods : {
    async login() {
      if (this.controller === undefined)
        throw new Error('Internal error, the login component requires controller access.');

      const user = await this.controller.login(this.instance, this.oauth, false);
      if (user instanceof Error) {
        this.authenticated.state = LifeCycle.Failed;
        this.last_error = user.message;
        return;
      }
      this.user = user;
      this.authenticated.state = LifeCycle.LoggedIn;
      this.last_error = '';
    },
    async logout() {
      if (this.controller === undefined)
        throw new Error('Internal error, the login component requires controller access.');

      this.controller.logout();
      this.authenticated.state = LifeCycle.LoggedOut;
      this.user = '';
    }
  }
});
</script>

<template>
    <div v-if="!authenticated.isLoggedIn()">
        <form @submit.prevent="login">
            <label for="instance">Instance:</label>
            <input type="url" v-model="instance" id="instance" required>
            <label for="oauth">Token:</label>
            <input type="text" v-model="oauth" id="oauth" required>
            <button type="submit">Log in</button>
        </form>
        <div v-if="authenticated.isFailed()">
        Failed: {{ last_error }}.
        </div>
    </div>
    <div v-else>
        <span>You are logged in as {{ user }} at {{ instance }}!</span>
        <button @click="logout">Logout</button>
    </div>
</template>

<style scoped>
</style>
