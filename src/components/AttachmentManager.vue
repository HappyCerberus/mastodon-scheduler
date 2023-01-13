<script lang="ts">
import { defineComponent } from 'vue';
import { MastodonController, MediaInfo } from '../lib/controller';

export default defineComponent({
    name: "AttachmentManager",
    props: {
        controller: {
            type: MastodonController,
            required: true
        },
        attachments: {
            type: Array<MediaInfo>,
            required: true
        }
    },
    data() {
        return {
            uploading: false
        }
    },
    methods: {
        async uploadMedia(event: Event) {
            const target = event.target as HTMLInputElement;
            if (!target || !target.files) return;
            this.uploading = true;
            for (let i = 0; i < target.files.length; i++) {
                const file = target.files.item(i);
                if (!file) continue;
                const media = await this.controller.uploadMedia(file);
                if (media instanceof Error) { // TODO
                    throw media;
                }
                this.attachments.push(media);
            }
            this.uploading = false;
        },
        deleteMedia(id: string) {
            for (let i = 0; i < this.attachments.length; i++) {
                if (this.attachments[i].id == id) {
                    this.attachments.splice(i,1);
                    return;
                }
            }
        },
        moveMediaUp(id: string) {
            for (let i = 1; i < this.attachments.length; i++) {
                if (this.attachments[i].id == id) {
                    const tmp = this.attachments[i-1];
                    this.attachments[i-1] = this.attachments[i];
                    this.attachments[i] = tmp;
                    return;
                }
            }
        },
        moveMediaDown(id: string) {
            for (let i = 0; i < this.attachments.length-1; i++) {
                if (this.attachments[i].id == id) {
                    const tmp = this.attachments[i+1];
                    this.attachments[i+1] = this.attachments[i];
                    this.attachments[i] = tmp;
                    return;
                }
            }
        }
    },
});
</script>

<template>
    <div class="container">
        <div v-if="uploading">
            <i class="fa-solid fa-upload"></i> Uploading <div class="progress"></div>
        </div>
        <div v-else>
            <label for="attachments" class="btn"><i class="fa-solid fa-paperclip"></i> Add attachments</label>
            <input type="file" accept="image/png,image/jpeg,image/gif,video/mp4,video/webm" multiple="true" @change.prevent="uploadMedia($event)" id="attachments"/>
        </div>
        <div v-if="attachments.length != 0" class="att-list">
            <div v-for="attachment in attachments" :key="attachment.id" class="att">
                <div class="attachment-link"><i class="fa-solid fa-link"></i> <a :href="attachment.url ?? attachment.preview_url">{{ attachment.id }}</a></div>
                <button class="btn" @click.prevent="moveMediaUp(attachment.id)"><i class="fa-solid fa-up"></i></button>
                <button class="btn" @click.prevent="moveMediaDown(attachment.id)"><i class="fa-solid fa-down"></i></button>
                <button class="btn" @click.prevent="deleteMedia(attachment.id)"><i class="fa-solid fa-trash-xmark"></i></button>
            </div>
        </div>
    </div>
</template>

<style scoped>
input[type="file"] {
    display: none;
}
.att-list {
    display: flex;
    flex-direction: column;
}
.att {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 0.3em;
    justify-content: space-between;
}
.container {
    display: flex;
    flex-direction: column;
    margin-top: 1em;
}
</style>