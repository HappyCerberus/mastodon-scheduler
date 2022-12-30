import { login, mastodon } from 'masto';

export class MastodonController {
    public async login(url: string, token: string, remember: Boolean) : Promise<string | Error> {
        try {
            this.client = await login({url: url, accessToken: token});
            const acc = await this.client.v1.accounts.verifyCredentials();
            this.user = acc.displayName;
            return this.user;
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                this.client = undefined;
                this.user = undefined;
                return e;
            } else {
                throw e;
            }
        }
    }

    public logout() {
        this.client = undefined;
    }

    public async uploadImage(file: File) {
        const resp = await this.client?.v2.mediaAttachments.create({file: file});
        if (!resp)
            throw Error("Failed to upload file.");
        return resp.id;
    }

    public async makePost(text: string, image_ids: string[]) {
        const resp = await this.client?.v1.statuses.create({mediaIds: image_ids, status: text, visibility: 'public'});
        if (!resp)
            throw Error("Failed to post status.");
        return resp.url;
    }

    public async schedulePost(datetime: string, text: string, image_ids: string[]) {
        const local = new Date(datetime);
        const resp = await this.client?.v1.statuses.create({scheduledAt: local.toISOString(), mediaIds: image_ids, status: text, visibility: 'public'});
        if (!resp)
            throw Error("Failed to schedule status.");
        return `Post ID: ${resp.id} Scheduled at: ${resp.scheduledAt}`;
    }

    // TODO (use localStorage)
    private remember(url: String, token: String) {}
    private forget() { }

    private client?: mastodon.Client = undefined;
    private user?: string = undefined;
}

const mastodon_controller = new MastodonController;
export default mastodon_controller;