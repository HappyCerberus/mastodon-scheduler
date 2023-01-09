<script lang="ts">
import FileUpload from './FileUpload.vue';
import { defineComponent } from 'vue';
import { MastodonController } from '../lib/controller';
import { postingState, PostingState } from '../lib/postingState';

export default defineComponent({
    name: "Editor",
    components: { FileUpload },
    props: { controller: MastodonController },
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
            statusInfo: ''
        }
    },
    computed: {
        charcount() {
            return this.form.text.length;
        }
    },
    methods: {
        async onSubmit() {
            if (!this.controller)
                throw new Error('Internal error, the editor component requires controller access.');
            
            this.url = '';
            const image : string[] = [];
            if (this.form.image) {
                postingState.state = PostingState.UploadingImages;
                const image_id = await this.controller?.uploadImage(this.form.image);
                if (image_id instanceof Error) {
                    postingState.state = PostingState.PostingError;
                    this.statusInfo = `Failed to upload image: ${image_id.cause} : ${image_id.message}`;
                    return;
                }
                image.push(image_id);
            }
            postingState.state = PostingState.Posting;
            if (this.form.schedule) {
                const info = await this.controller?.schedulePost(this.form.datetime, this.form.text, image);
                if (info instanceof Error) {
                    postingState.state = PostingState.PostingError;
                    this.statusInfo = `Failed to schedule post: ${info.message}`;
                    return;
                }
                this.url = info;
            } else {
                const info = await this.controller?.makePost(this.form.text, image);
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
            <file-upload v-model="form.image"></file-upload>
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
    <div v-else-if="post.isUploadingImages()">
        <div>Uploading Images <div class="progress"></div></div>
    </div>
</template>

<style scoped>
#form {
    display: flex;
    flex-direction: column;
}
</style>
