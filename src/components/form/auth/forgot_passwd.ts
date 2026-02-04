import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement("element-forgot_passwd_form")
export class ElementForgotPasswdForm extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render() {
        return html`
            <form class="flex flex-col gap-y-4">
                <element-input label="Email" icon="fa-envelope" placeholder="Nhập email lấy lại mật khẩu" type="email" autocomplete="email"></element-input>
              
                <button type="submit" class="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
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