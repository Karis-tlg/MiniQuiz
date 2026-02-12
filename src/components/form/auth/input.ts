import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("element-input")
export class ElementInput extends LitElement {
    @property() icon?: string
    @property() label!: string
    @property() placeholder!: string
    @property() autocomplete: any | string = "off"
    @property() type: "text" | "email" | "password" | "number" | "tel" | "url" | "search" = "text"

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    togglePasswordVisibility(button: HTMLElement) {
        const input = this.querySelector("input") as HTMLInputElement
        const icon = button.querySelector("i") as HTMLElement
        if (input.type === "password") {
            input.type = "text"
            icon.classList.replace("fa-eye-slash", "fa-eye")
        } else {
            input.type = "password"
            icon.classList.replace("fa-eye", "fa-eye-slash")
        }
    }

    protected render() {
        return html`
            <div>
                <label class="text-sm text-gray-400">${this.label}</label>
                <div class="relative">
                    ${this.icon ? html`
                        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none select-none text-gray-400">
                            <i class="fa-solid ${this.icon} translate-y-0.5"></i>
                        </div>
                    ` : null}
                    <input autocomplete=${this.autocomplete} type="${this.type}" placeholder="${this.placeholder}" class="mt-1 w-full px-8 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    ${ this.type === "password" ? html`
                        <button @click=${(button: PointerEvent) => this.togglePasswordVisibility(button.currentTarget as HTMLElement)} type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200">
                            <i class="fa-solid fa-eye-slash translate-y-0.5"></i>
                        </button>
                    ` : null }
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-input": ElementInput
    }
}