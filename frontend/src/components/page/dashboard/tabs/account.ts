import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ref, type Ref, createRef } from 'lit/directives/ref.js'
import "../../auth/input"
import { logoutUser } from '../../../../apis/user'

@customElement('element-tab-account')
export class ElementTabAccount extends LitElement {
    @property({ attribute: false }) user!: User
    @property({ attribute: false }) stats!: { created: number, done: number }
    usernameIRef: Ref<HTMLInputElement> = createRef()
    emailIRef: Ref<HTMLInputElement> = createRef()
    passwordIRef: Ref<HTMLInputElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected logout() {
        logoutUser().then(() => {
            window.location.href = "/auth"
        })
    }

    render_role() {
        switch (this.user.role) {
            case "admin":
                return html`<span class="px-2 py-1 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium">Quản trị viên</span>`
            case "member":
                return html`<span class="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-sm font-medium">Thành viên</span>`
            default:
                return null
        }
    }

    render() {
        return html`
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-3 shadow shadow-gray-800 rounded-lg border border-gray-700 p-8">
                <div class="flex items-center gap-5">
                    <element-avatar avatar_url=${this.user?.avatar} class="w-24 h-24 border border-gray-700 rounded-full"></element-avatar>
                    <div>
                        <h2 class="text-2xl font-semibold">${this.user?.username}</h2>
                        <p class="text-sm text-default-text-sub">${this.user?.email}</p>
                        <div class="mt-4 flex gap-3">
                            ${this.render_role()}
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-3 divide-x-2 divide-gray-700 flex-row gap-1 border-t md:border-t-0 md:border-l border-gray-700 pt-5 md:pt-0 md:pl-5">
                    <div class="flex flex-col items-center justify-center gap-3 text-sm">
                        <span class="text-default-text font-semibold text-lg">${this.stats?.created}</span>
                        <span class="text-default-text-sub">Quiz đã tạo</span>
                    </div>
                    <div class="flex flex-col items-center justify-center gap-3 text-sm">
                        <span class="text-default-text font-semibold text-lg">${this.stats?.done}</span>
                        <span class="text-default-text-sub">Quiz đã làm</span>
                    </div>
                    <div class="flex flex-col items-center justify-center gap-3 text-sm">
                        <span class="text-default-text font-semibold text-lg">${this.user?.createAt.slice(0, 10)}</span>
                        <span class="text-default-text-sub">Ngày tham gia</span>
                    </div>
                </div>
            </div>
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 mb-20 shadow shadow-gray-800">
                <div class="flex flex-col items-center w-full p-5 border border-gray-700 rounded-lg shadow shadow-gray-800">
                    <h2 class="text-xl font-semibold mb-5 w-full h-fit text-left">Thông tin tài khoản</h2>
                    <div class="w-full flex flex-col gap-4">
                        <element-input ${ref(this.usernameIRef)} label="Tên người dùng" icon="user" placeholder="Nhập tên người dùng" type="text" regex_type="username" autocomplete="name" value=${this.user?.username}></element-input>
                        <element-input disabled ${ref(this.emailIRef)} label="Email" icon="mail" placeholder="Nhập email" type="email" regex_type="email" autocomplete="email" value=${this.user?.email}></element-input>
                        <element-input ${ref(this.passwordIRef)} label="Mật khẩu mới" icon="lock-closed" placeholder="Nhập mật khẩu" type="password" regex_type="password" autocomplete="new-password"></element-input>
                    </div>
                    <button class="w-fit mt-4 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-default-text font-semibold">
                        <element-icon icon="save"></element-icon> Lưu thay đổi
                    </button>
                </div>
                <div class="flex flex-col items-center w-full h-fit p-5 border border-gray-700 rounded-lg shadow shadow-gray-800">
                    <h2 class="text-xl font-semibold mb-5 w-full text-left">Vùng nguy hiểm</h2>
                    <div class="flex flex-col gap-y-3 w-full">
                        <div class="w-full flex items-center flex-nowrap gap-4 p-1.5">
                            <div class="w-full">
                                <span class="block text-lg font-semibold text-gray-400">Đăng xuất</span>
                                <span class="block text-sm text-gray-500">Đăng xuất khỏi tài khoản hiện tại</span>
                            </div>
                            <button @click=${this.logout} class="px-4 py-3 h-fit rounded-xl border border-red-400 hover:border-red-500 text-white hover:text-red-500 whitespace-nowrap font-semibold">
                                <element-icon icon="log-out"></element-icon> Đăng xuất
                            </button>
                        </div>
                        <div class="w-full h-0.5 bg-gray-700 rounded-lg"></div>
                        <div class="w-full flex items-center flex-nowrap gap-4 p-1.5">
                            <div class="w-full">
                                <span class="block text-lg font-semibold text-gray-400">Xóa tài khoản</span>
                                <span class="block text-sm text-gray-500">Hành động này không thể hoàn tác. Hãy cân nhắc kỹ trước khi thực hiện.</span>
                            </div>
                            <button class="cursor-not-allowed px-4 py-3 h-fit rounded-xl border border-red-400 hover:border-red-500 text-white hover:text-red-500 whitespace-nowrap font-semibold">
                                <element-icon icon="trash"></element-icon> Xóa tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-tab-account": ElementTabAccount
    }
}