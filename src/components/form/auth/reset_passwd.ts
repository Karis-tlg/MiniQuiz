import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { ElementInput } from "./input"
import { resetpasswordUser } from "../../../apis/user"

@customElement("element-reset_passwd_form")
export class ElementResetPasswordForm extends LitElement {
    @property() turnstileWidgetId!: string

    private passwordIRef: Ref<ElementInput> = createRef()
    private confirmPasswordIRef: Ref<ElementInput> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected async submit(e: Event) {
        const btn = e.currentTarget as HTMLButtonElement
        btn.disabled = true

        const password = this.passwordIRef.value?.get_value()
        const confirmPassword = this.confirmPasswordIRef.value?.get_value()

        if (!password || !confirmPassword) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Vui lòng nhập đầy đủ thông tin", type: "error" } }))
            btn.disabled = false
            return
        }

        if (password !== confirmPassword) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Mật khẩu không giống nhau", type: "error" } }))
            btn.disabled = false
            return
        }

        const token = new URLSearchParams(window.location.search).get("token")
        if (!token) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Token không hợp lệ", type: "error" } }))
            btn.disabled = false
            return
        }

        const response = await resetpasswordUser(password, token, turnstile.getResponse(this.turnstileWidgetId))
        if (response.status === "success") {
            window.location.href = `/auth?message=${response.message}&type=success`
        } else {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: response.detail, type: "error" } }))
            turnstile.reset(this.turnstileWidgetId)
            btn.disabled = false
        }
    }

    protected render() {
        return html`
            <form class="flex flex-col gap-y-4">
                <element-input ${ref(this.passwordIRef)} label="Mật khẩu" icon="fa-lock" placeholder="Nhập mật khẩu mới" type="password" autocomplete="new-password" regex_type="password"></element-input>
                <element-input ${ref(this.confirmPasswordIRef)} label="Nhập lại mật khẩu" icon="fa-lock" placeholder="Nhập lại mật khẩu" type="password" regex_type="password"></element-input>

                <button type="button" class="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-700 text-white font-semibold">
                    Thay đổi mật khẩu
                </button>
            </form>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-reset_passwd_form": ElementResetPasswordForm
    }
}
declare const turnstile: any