import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement("element-navbar")
export class ElementNavbar extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render() {
        return html`
            <header>
                <nav class="fixed top-0 w-full h-14 z-100 bg-default-card/25 backdrop-blur-sm border-b border-default-border px-4 py-2.5">
                    <div class="flex items-center justify-between">
                        <a href="/" class="flex items-center hover:opacity-75 transition-opacity">
                            <img alt="Logo" class="mr-3 h-6 sm:h-9" src="/logo.svg" />
                            <span class="self-center text-xl font-semibold whitespace-nowrap">MiniQuiz</span>
                        </a>
                        <div class="flex items-center">
                        </div>
                    </div>
                </nav>
            </header>
        `

    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-navbar": ElementNavbar
    }
}