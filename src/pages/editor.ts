import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import "../components/navbar"
import "../components/form/editor/sidebar"

@customElement("page-editor")
export class PageEditor extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render() {
        return html`
            <element-navbar></element-navbar>
            <element-sidebar></element-sidebar>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "page-editor": PageEditor
    }
}