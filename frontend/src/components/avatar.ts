import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { getUserData } from "../apis/user"

@customElement("element-avatar")
export class ElementAvatar extends LitElement {
    @state() avatar_url: string = ""

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async firstUpdated() {
        const user = await getUserData()
        this.avatar_url = user.avatar
    }

    render() {
        return html`
            <div class="w-full h-full rounded-full overflow-hidden ${!this.avatar_url ? "bg-gray-500" : ""}">
                <img src="${this.avatar_url}" alt="Avatar" .hidden="${!this.avatar_url}" class="w-full h-full object-cover" />
            </div>
        `
    }
}