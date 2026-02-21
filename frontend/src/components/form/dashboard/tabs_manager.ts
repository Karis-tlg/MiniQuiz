import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { repeat } from "lit/directives/repeat.js"

@customElement("element-tabs-manager")
export class ElementTabsManager extends LitElement {
    @property({ attribute: false }) tabs!: Array<{ id: string, icon: string, name: string } | { id: string }>
    @property({ attribute: false }) activeTab!: string

    connectedCallback(): void {
        super.connectedCallback()
        this.activeTab = this.tabs[0].id
    }

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    changeTab(tab_id: string) {
        this.activeTab = tab_id
        window.dispatchEvent(new CustomEvent("change-tab", { detail: tab_id }))
    }

    render() {
        return html`
            <nav class="fixed z-100 w-full md:w-80 bottom-0 md:top-14 md:left-0 bg-default-background/70 backdrop-blur-md border-t md:border-t-0 md:border-r border-slate-700 p-4">
                <p class="hidden md:block text-gray-500 text-sm font-semibold tracking-wider uppercase w-full pl-5">Tổng quan</p>
                <div class="flex flex-row md:flex-col gap-1 md:mt-3">
                    ${repeat(this.tabs, (tab) => {
                        if (('icon' in tab) && ('name' in tab)) {
                            return html`
                                <button @click="${() => this.changeTab(tab.id)}" class="flex items-center justify-center md:justify-start gap-3 text-lg w-full px-4 py-2 rounded-xl font-thin ${tab.id === this.activeTab ? 'bg-linear-to-r from-indigo-500/50 to-indigo-500/25 text-indigo-100 font-normal md:pl-5' : 'hover:bg-white/25 text-gray-400 hover:text-gray-200'} transition">
                                    <element-icon icon="${tab.icon}"></element-icon>
                                    <span class="hidden md:block">${tab.name}</span>
                                </button>
                            `
                        } else if (tab.id === "split") {
                            return html`
                                <div class="hidden md:block w-full h-0.5 bg-gray-700/25"></div>
                            `
                        }
                    })}
                </div>
            </nav>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-tabs-manager": ElementTabsManager
    }
}