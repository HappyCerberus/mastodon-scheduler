<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "FileUpload",
    props: ['modelValue'],
    methods: {
        onChange(event : Event) {
            const target = event.target as HTMLInputElement;
            if (target && target.files)
                this.$emit('update:modelValue', target.files[0]);
        },
    },
});
</script>

<template>
    <input type="file" accept="image/*" @change="onChange($event)"/>
</template>