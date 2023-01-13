<script lang="ts">
import { defineComponent } from 'vue';
import { MastodonController, ScheduledPostInfo } from '../lib/controller';
import { lifeCycle, LifeCycle } from '../lib/loginState';

export default defineComponent({
    name: "ScheduledPosts",
    props: {
        controller: {
            type: MastodonController,
            required: true
        },
    },
    data() {
        return {
            authenticated: lifeCycle,
            posts: Array<ScheduledPostInfo>()
        }
    },
    computed: {
        watchme: function() { return this.authenticated.state; }
    },
    watch: {
        watchme: {
            handler: function (newState: LifeCycle) {
                if (newState != LifeCycle.LoggedIn) return;
                this.controller.getScheduledPosts().then((posts: Array<ScheduledPostInfo> | Error) => {
                    if (posts instanceof Error) throw posts;
                    this.posts = posts;
                });
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async deletePost(id: string) {
            await this.controller.deleteScheduledPost(id);
            for (let i = 0; i < this.posts.length; i++) {
                if (this.posts[i].id == id) {
                    this.posts.splice(i,1);
                    return;
                }
            }
        }
    }
});
</script>

<template>
    <div v-if="authenticated.isLoggedIn()">
        Scheduled posts:
        <div v-for="post of posts" :key="post.id" class="post">
            <div>{{ post.date.toString() }}: {{ post.text }}</div>
            <button class="btn" @click.prevent="deletePost(post.id)"><i class="fa-solid fa-trash-xmark"></i></button>
        </div>
    </div>
</template>

<style scoped>
.post {
    font-size: 0.7em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.3em;
}
</style>