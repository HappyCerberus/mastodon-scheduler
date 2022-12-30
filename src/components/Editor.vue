<script lang="ts">
import FileUpload from './FileUpload.vue';
import { defineComponent } from 'vue';
import { MastodonController } from '../lib/controller';
import { from } from 'form-data';

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
        }
    },
    methods: {
        async onSubmit() {
            if (!this.controller)
                throw new Error('Internal error, the editor component requires controller access.');

            console.log(this.form);
            this.url = '';
            if (this.form.image) {
                const image_id = await this.controller?.uploadImage(this.form.image);
                if (this.form.schedule) {
                    const info = await this.controller?.schedulePost(this.form.datetime, this.form.text, [image_id]);
                    if (info) this.url = info;
                } else {
                    const url = await this.controller?.makePost(this.form.text, [image_id]);
                    if (url) this.url = url;
                }
                this.form.text = '';
                this.form.image = null;
            } else {
                if (this.form.schedule) {
                    const info = await this.controller?.schedulePost(this.form.datetime, this.form.text, []);
                    if (info) this.url = info;
                } else {
                    const url = await this.controller?.makePost(this.form.text, []);
                    if (url) this.url = url;
                }
                this.form.text = '';
            }
        },
        hasURL() {
            return this.url.length != 0;
        }
    }
});
</script>

<template>
<form novalidate @submit.prevent="onSubmit" id="form">
    <textarea rows="20" cols="80" type="text" v-model="form.text" id="text" required/>
    <file-upload v-model="form.image"></file-upload>
    <span><label for="schedule">Schedule this post</label><input type="checkbox" v-model="form.schedule" id="schedule" /></span>
    <input v-if="form.schedule" type="datetime-local" v-model="form.datetime" id="datetime" />
    <button type="submit">Post</button>
</form>
<div v-if="hasURL()">
    <a :href="url">{{ url }}</a>
</div>
</template>

<style scoped>
#form {
    display: flex;
    flex-direction: column;
}
</style>
