import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement("element-register_form")
export class ElementRegisterForm extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render() {
        return html`
            <form class="flex flex-col gap-y-4">
                <element-input label="Tên người dùng" icon="fa-user" placeholder="Nhập tên người dùng" type="text" autocomplete="name"></element-input>
                <element-input label="Email" icon="fa-envelope" placeholder="Nhập email" type="email" autocomplete="email"></element-input>
                <element-input label="Mật khẩu" icon="fa-lock" placeholder="Nhập mật khẩu" type="password" autocomplete="new-password"></element-input>
                <element-input label="Nhập lại mật khẩu" icon="fa-lock" placeholder="Nhập lại mật khẩu" type="password"></element-input>

                <button type="submit" class="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
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