import { reactive } from 'vue'

export enum LifeCycle {
    LoggedOut,
    LoggedIn,
    Failed
}

export const lifeCycle = reactive({
    state: LifeCycle.LoggedOut,
    isLoggedIn() { return this.state == LifeCycle.LoggedIn; },
    isFailed() { return this.state == LifeCycle.Failed; }
})