import { login, mastodon } from 'masto';

class LoginInfo {
    constructor(instance: string, oauth: string) {
      this.instance = instance;
      this.oauth = oauth;
    }
    public instance: string;
    public oauth: string;
}

export interface UserInfo {
    instance: string;
    user: string;
}

export class MastodonController {
    public async memorized_login() : Promise<UserInfo | Error> {
        const memorized = localStorage.getItem("mastodon-scheduler-auth");
        if (memorized) {
            const auth = JSON.parse(memorized) as LoginInfo;
            return await this.login(auth.instance, auth.oauth, false);
        }
        return Error("no credentials stored");
    }

    public async login(url: string, token: string, remember: Boolean) : Promise<UserInfo | Error> {
        try {
            this.client = await login({url: url, accessToken: token});
            const acc = await this.client.v1.accounts.verifyCredentials();
            this.user = acc.displayName;
            if (remember) {
                const auth = new LoginInfo(url, token);
                localStorage.setItem("mastodon-scheduler-auth", JSON.stringify(auth));
            }
            return {instance: url, user: this.user};
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
        localStorage.clear();
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

    private client?: mastodon.Client = undefined;
    private user?: string = undefined;
}

const mastodon_controller = new MastodonController;
export default mastodon_controller;