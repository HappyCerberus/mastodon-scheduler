import { reactive } from 'vue'

export enum PostingState {
    Ready,
    UploadingImages,
    Posting,
    SchedulingPost,
    Posted,
    PostingError
}

export const postingState = reactive({
    state: PostingState.Ready,
    isReady() { return this.state == PostingState.Ready; },
    isUploadingImages() { return this.state == PostingState.UploadingImages; },
    isPosting() { return this.state == PostingState.Posting; },
    isSchedulingPost() { return this.state == PostingState.SchedulingPost; },
    isPosted() { return this.state == PostingState.Posted; },
    isError() { return this.state == PostingState.PostingError; },
    canPost() { return this.state == PostingState.Ready || this.state == PostingState.Posted || this.state == PostingState.PostingError; }
})