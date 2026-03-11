import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { ElementInput } from "./input"
import { loginUser } from "../../../apis/user"

@customElement("element-login_form")
export class ElementLoginForm extends LitElement {
    @property() turnstileWidgetId: any

    emailIRef: Ref<ElementInput> = createRef()
    passwordIRef: Ref<ElementInput> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected async submit(e: Event) {
        const btn = e.currentTarget as HTMLButtonElement
        btn.disabled = true

        const email = this.emailIRef.value!.get_value()
        const password = this.passwordIRef.value!.get_value()

        if (!email || !password) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Vui lòng nhập đầy đủ thông tin", type: "error" } }))
            btn.disabled = false
            return
        }

        const response = await loginUser(email, password, turnstile.getResponse(this.turnstileWidgetId))
        if (response.status === "success") {
            window.location.href = "/dashboard"
        } else {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: response.detail, type: "error" } }))
            turnstile.reset(this.turnstileWidgetId)
            btn.disabled = false
        }
    }

    protected render() {
        return html`
            <form class="flex flex-col gap-y-4">
                <element-input ${ref(this.emailIRef)} label="Email" icon="mail" placeholder="Nhập email" type="email" autocomplete="email"></element-input>
                <element-input ${ref(this.passwordIRef)} label="Mật khẩu" icon="lock-closed" placeholder="Nhập mật khẩu" type="password" autocomplete="current-password"></element-input>

                <button @click=${this.submit} type="button" class="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-700 text-white font-semibold">
                    Đăng nhập
                </button>
            </form>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-login_form": ElementLoginForm
    }
}
declare const turnstile: any;