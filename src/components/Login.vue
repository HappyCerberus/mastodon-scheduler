<script lang="ts">
import { defineComponent } from 'vue'
import { MastodonController } from '../lib/controller'
import { lifeCycle, LifeCycle } from '../lib/loginState'
import LoginForm from './LoginForm.vue';

export default defineComponent({
    name: "Login",
    beforeMount() {
        if (this.controller === undefined)
            throw new Error("Internal error, the login component requires controller access.");
        if (this.controller.has_memorized_login())
            lifeCycle.state = LifeCycle.LoggingIn;
        this.controller.memorized_login().then((user) => {
            if (user instanceof Error) {
                this.authenticated.state = LifeCycle.LoggedOut;
                return;
            }
            this.user = user.user;
            this.instance = user.instance;
            this.authenticated.state = LifeCycle.LoggedIn;
            this.last_error = "";
        });
    },
    data() {
        return {
            instance: "",
            user: "",
            last_error: "",
            authenticated: lifeCycle,
        };
    },
    props: {
        controller: MastodonController
    },
    methods: {
        async login(instance: string, oauth: string, remember: Boolean) {
            if (this.controller === undefined)
                throw new Error("Internal error, the login component requires controller access.");
            lifeCycle.state = LifeCycle.LoggingIn;
            const user = await this.controller.login(instance, oauth, remember);
            if (user instanceof Error) {
                this.authenticated.state = LifeCycle.Failed;
                this.last_error = user.message;
                return;
            }
            this.user = user.user;
            this.instance = instance;
            this.authenticated.state = LifeCycle.LoggedIn;
            this.last_error = "";
        },
        async logout() {
            if (this.controller === undefined)
                throw new Error("Internal error, the login component requires controller access.");
            this.controller.logout();
            this.authenticated.state = LifeCycle.LoggedOut;
            this.user = "";
        }
    },
    components: { LoginForm }
});
</script>

<template>
    <div v-if="authenticated.isLoggedOutOrFail()">
        <LoginForm @login="login" />
        <div v-if="authenticated.isFailed()">
            Failed: {{ last_error }}.
        </div>
    </div>
    <div v-else-if="authenticated.isLoggingIn()">Logging In<div class="progress"></div>
    </div>
    <div v-else>
        <span>You are logged in as {{ user }} at {{ instance }}!</span>
        <button @click="logout">Logout</button>
    </div>
</template>

<style scoped>

</style>
