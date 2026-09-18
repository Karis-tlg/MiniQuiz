import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { registerUser } from "../../../apis/user"
import type { ElementInput } from "./input"

@customElement("element-register_form")
export class ElementRegisterForm extends LitElement {
    @property() turnstileWidgetId!: string

    private usernameIRef: Ref<ElementInput> = createRef()
    private emailIRef: Ref<ElementInput> = createRef()
    private passwordIRef: Ref<ElementInput> = createRef()
    private confirmPasswordIRef: Ref<ElementInput> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected async submit(e: Event) {
        const btn = e.currentTarget as HTMLButtonElement
        btn.disabled = true

        const username = this.usernameIRef.value!.get_value()
        const email = this.emailIRef.value!.get_value()
        const password = this.passwordIRef.value!.get_value()
        const confirmPassword = this.confirmPasswordIRef.value!.get_value()

        if (!username || !email || !password || !confirmPassword) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Vui lòng nhập đầy đủ thông tin", type: "error" } }))
            btn.disabled = false
            return
        }
    
        if (password !== confirmPassword) {
            window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: "Mật khẩu không giống", type: "error" } }))
            btn.disabled = false
            return
        }

        const response = await registerUser(username, email, password, turnstile.getResponse(this.turnstileWidgetId))
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
                <element-input ${ref(this.usernameIRef)} label="Tên người dùng" icon="user" placeholder="Nhập tên người dùng" type="text" regex_type="username" autocomplete="name"></element-input>
                <element-input ${ref(this.emailIRef)} label="Email" icon="mail" placeholder="Nhập email" type="email" regex_type="email" autocomplete="email"></element-input>
                <element-input ${ref(this.passwordIRef)} label="Mật khẩu" icon="lock-closed" placeholder="Nhập mật khẩu" type="password" regex_type="password" autocomplete="new-password"></element-input>
                <element-input ${ref(this.confirmPasswordIRef)} label="Nhập lại mật khẩu" icon="lock-closed" placeholder="Nhập lại mật khẩu" regex_type="password" type="password"></element-input>

                <button @click=${this.submit} type="button" class="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-700 text-white font-semibold">
                    Đăng ký
                </button>
            </form>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-register_form": ElementRegisterForm
    }
}

declare const turnstile: any;