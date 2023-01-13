<script lang="ts">
import AttachmentManager from './AttachmentManager.vue';
import { defineComponent } from 'vue';
import { MastodonController, MediaInfo } from '../lib/controller';
import { postingState, PostingState } from '../lib/postingState';

export default defineComponent({
    name: "Editor",
    components: { AttachmentManager },
    props: { controller: {type: MastodonController, required: true} },
    data() {
        return {
            form: {
                text: '',
                schedule: false,
                datetime: '',
                image: <File | null>(null)
            },
            url: '',
            post: postingState,
            statusInfo: '',
            attachments: new Array<MediaInfo>(),
        }
    },
    computed: {
        charcount() {
            return this.form.text.length;
        }
    },
    methods: {
        // Convert Array of MediaInfo into a list of IDs
        getAttachmentIDs() {
            let attachments : string[] = [];
            for (const a of this.attachments) {
                attachments.push(a.id);
            }
            return attachments;
        },
        async onSubmit() {
            this.url = '';
            // Fetch IDs from attachments
            let attachments : string[] = this.getAttachmentIDs();
            this.attachments = new Array<MediaInfo>();
            
            postingState.state = PostingState.Posting;
            if (this.form.schedule) {
                const info = await this.controller?.schedulePost(this.form.datetime, this.form.text, attachments);
                if (info instanceof Error) {
                    postingState.state = PostingState.PostingError;
                    this.statusInfo = `Failed to schedule post: ${info.message}`;
                    return;
                }
                this.url = info;
            } else {
                const info = await this.controller?.makePost(this.form.text, attachments);
                if (info instanceof Error) {
                    postingState.state = PostingState.PostingError;
                    this.statusInfo = `Failed to post: ${info.message}`;
                    return;
                }
                if (info) this.url = info;
            }
            this.form.text = '';
            this.form.image = null;
            postingState.state = PostingState.Posted;
        },
        hasURL() {
            return this.url.length != 0;
        }
    }
});
</script>

<template>
    <div v-if="post.canPost()">
        <form novalidate @submit.prevent="onSubmit" id="form">
            <textarea rows="20" cols="80" type="text" v-model="form.text" id="text" required />
            <div>Character count: {{ charcount }}</div>
            <attachment-manager :controller="controller" :attachments="attachments"></attachment-manager>
            <span>
                <label for="schedule">Schedule this post</label>
                <input type="checkbox" v-model="form.schedule" id="schedule" />
            </span>
            <input v-if="form.schedule" type="datetime-local" v-model="form.datetime" id="datetime" />
            <button type="submit">Post</button>
        </form>
        <div v-if="post.isPosted()">
            <a :href="url">{{ url }}</a>
        </div>
        <div v-else-if="post.isError()">
            <div>{{ statusInfo }}</div>
        </div>
    </div>
    <div v-else-if="post.isPosting()">
        <div>Posting <div class="progress"></div></div>
    </div>
    <div v-else-if="post.isSchedulingPost()">
        <div>Scheduling Post <div class="progress"></div></div>
    </div>
</template>

<style scoped>
#form {
    display: flex;
    flex-direction: column;
}
</style>
