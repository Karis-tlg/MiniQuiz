import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit-html/directives/ref.js"

@customElement("element-dropdown-text")
export class Dropdown extends LitElement {
    @property() summary: string = ""
    @property() details: string = ""
    detailsDivRef: Ref<HTMLDivElement> = createRef()
    iconRef: Ref<HTMLElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    toggle_handle(e: MouseEvent) {
        this.detailsDivRef.value?.classList.toggle("hidden");
        this.iconRef.value?.classList.toggle("rotate-180");
        (e.currentTarget as HTMLButtonElement).classList.toggle("border-b");
    }

    render() {
        return html`
            <div class="w-full rounded-lg border border-gray-800">
                <button @click=${this.toggle_handle} class="w-full flex items-center justify-between px-6 py-2 border-gray-600 bg-gray-800/75 hover:bg-gray-800 backdrop-blur-lg">
                    <span class="font-semibold">${this.summary}</span>
                    <element-icon ${ref(this.iconRef)} icon="chevron-down" class="transition-transform"></element-icon>
                </button>
                <div ${ref(this.detailsDivRef)} class="hidden w-full p-5 bg-gray-800/50 backdrop-blur-lg">${this.details}</div>
            </div>
        `
    }
}