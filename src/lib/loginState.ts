import { reactive } from 'vue'

export enum LifeCycle {
    LoggedOut,
    LoggingIn,
    LoggedIn,
    Failed
}

export const lifeCycle = reactive({
    state: LifeCycle.LoggedOut,
    isLoggedIn() { return this.state == LifeCycle.LoggedIn; },
    isLoggedOutOrFail() { return this.state == LifeCycle.LoggedOut || this.state == LifeCycle.Failed; },
    isLoggingIn() { return this.state == LifeCycle.LoggingIn; },
    isFailed() { return this.state == LifeCycle.Failed; }
})