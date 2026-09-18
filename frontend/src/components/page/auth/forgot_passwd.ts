import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { ElementInput } from "./input"
import { forgotpasswordUser } from "../../../apis/user"

@customElement("element-forgot_passwd_form")
export class ElementForgotPasswdForm extends LitElement {
    @property() turnstileWidgetId!: string
    
    private emailIRef: Ref<ElementInput> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected async submit(e: Event) {
        const btn = e.currentTarget as HTMLButtonElement
        btn.disabled = true

        const email = this.emailIRef.value!.get_value()

        if (!email) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Vui lòng nhập đầy đủ thông tin", type: "error" } }))
            btn.disabled = false
            return
        }

        const response = await forgotpasswordUser(email, turnstile.getResponse(this.turnstileWidgetId))
        if (response.status === "success") {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: response.message, type: "success" } }))
        } else {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: response.detail, type: "error" } }))
        }
        turnstile.reset(this.turnstileWidgetId)
        btn.disabled = false
    }

    protected render() {
        return html`
            <form class="flex flex-col gap-y-4">
                <element-input ${ref(this.emailIRef)} label="Email" icon="mail" placeholder="Nhập email lấy lại mật khẩu" type="email" autocomplete="email"></element-input>
              
                <button @click=${this.submit} type="button" class="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-700 text-white font-semibold">
                    Gửi yêu cầu
                </button>
            </form>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-forgot_passwd_form": ElementForgotPasswdForm
    }
}
declare const turnstile: any