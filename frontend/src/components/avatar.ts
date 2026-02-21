import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("element-avatar")
export class ElementAvatar extends LitElement {
    @property({ type: String }) avatar_url: string = ""

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    render() {
        return html`
            <div class="w-full h-full rounded-full border border-gray-800 overflow-hidden ${!this.avatar_url ? "bg-gray-500" : ""}">
                <img src="${this.avatar_url}" alt="Avatar" .hidden="${!this.avatar_url}" class="w-full h-full object-cover" />
            </div>
        `
    }
}