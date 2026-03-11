import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { type ElementIcon } from "../../icon"

@customElement("element-input")
export class ElementInput extends LitElement {
    @property() icon?: string
    @property() label!: string
    @property() placeholder!: string
    @property() autocomplete: any | string = "off"
    @property() regex_type: "email" | "password" | "username" | "off" = "off"
    @property() type: "text" | "email" | "password" | "number" | "tel" | "url" | "search" = "text"
    @property({ type: Boolean }) disabled: boolean = false
    @property() value: string = ""
    private inputRef: Ref<HTMLInputElement> = createRef()
    private iconpwdRef: Ref<ElementIcon> = createRef()

    // private regex_check_full = {
    //     "email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,256}$/,
    //     "password": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,128}$/,
    //     "username": /^[a-zA-Z0-9]{4,32}$/,
    // }

    private regex_check = {
        email: [
            {
                regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,256}$/,
                message: "Email không đúng định dạng"
            }
        ],
        username: [
            {
                regex: /^.{4,32}$/,
                message: "Tên người dùng cần 4 kí tự trở lên và tối đa 32 kí tự"
            },
            {
                regex: /^[a-zA-Z0-9 ]+$/,
                message: "Tên người dùng chỉ được chứa chữ cái, số và dấu cách"
            }
        ],
        password: [
            {
                regex: /^.{8,128}$/,
                message: "Mật khẩu cần 8 kí tự trở lên và tối đa 128 kí tự"
            },
            {
                regex: /.*[a-z].*/,
                message: "Mật khẩu cần có ít nhất 1 chữ cái thường (a-z)"
            },
            {
                regex: /.*[A-Z].*/,
                message: "Mật khẩu cần có ít nhất 1 chữ cái hoa (A-Z)"
            },
            {
                regex: /.*\d.*/,
                message: "Mật khẩu cần có ít nhất 1 số (0-9)"
            },
            {
                regex: /.*[\W_].*/,
                message: "Mật khẩu cần có ít nhất 1 kí tự đặt biệt (!@#$%^&*()_/-+=)"
            }
        ]
    }

    protected inputRegexCheck(e: Event) {
        if (this.regex_type !== "off") {
            const regexs = this.regex_check[this.regex_type]
            const element = e.currentTarget as HTMLInputElement
            for (const regex of regexs) {
                if (!regex.regex.test(element.value)) {
                    element.setCustomValidity(regex.message)
                    return
                }
            }
            element.setCustomValidity("")
        }
    }

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    togglePasswordVisibility() {
        if (this.inputRef.value!.type === "password") {
            this.inputRef.value!.type = "text"
            this.iconpwdRef.value!.setAttribute("icon", "eye")
        } else {
            this.inputRef.value!.type = "password"
            this.iconpwdRef.value!.setAttribute("icon", "eye-off")
        }
        this.iconpwdRef.value!.requestUpdate()
    }

    get_value() {
        return this.inputRef.value?.value
    }

    set_value(value: string) {
        this.inputRef.value!.value = value
    }

    protected render() {
        return html`
            <div>
                <label class="text-sm text-gray-400">${this.label}</label>
                <div class="relative">
                    ${this.icon ? html`
                        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none select-none text-gray-400">
                            <element-icon icon="${this.icon}" class="translate-y-0.5"></element-icon>
                        </div>
                    ` : null}
                    <input ${ref(this.inputRef)} @input=${this.inputRegexCheck} @change=${(e: Event) => {if(this.regex_type !== "off") (e.currentTarget as HTMLInputElement).reportValidity()}} ?disabled=${this.disabled} autocomplete=${this.autocomplete} type="${this.type}" placeholder="${this.placeholder}" class="mt-1 w-full px-8 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-0 focus:valid:border-indigo-500 ${this.regex_type !== "off" ? 'invalid:border-red-500' : ''} disabled:cursor-not-allowed disabled:text-gray-400" .value="${this.value}"/>
                    ${ this.type === "password" ? html`
                        <button @click=${() => requestAnimationFrame(() => this.togglePasswordVisibility())} type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200">
                            <element-icon ${ref(this.iconpwdRef)} icon="eye-off" class="translate-y-0.5"></element-icon>
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