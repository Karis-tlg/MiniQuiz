import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { repeat } from "lit/directives/repeat.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import "../components/icon"
import "../components/navbar"
import "../components/notify"
import "../components/page/auth"
import googleLogo from "../assets/google.svg"
import discordLogo from "../assets/discord.svg"
import auth_illustration from "../assets/auth_illustration.svg"
import { hasUserLogged } from "../apis/user"
import { waitCloudflareTurnstile } from "../utils/utils"

@customElement("page-auth")
export class PageAuth extends LitElement {
    @state() currentForm: number = 0
    @state() turnstile_widgetId: any
    private turnstileRef: Ref<HTMLDivElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected firstUpdated() {
        waitCloudflareTurnstile(5000).then(() => {
            this.turnstile_widgetId = turnstile.render(this.turnstileRef.value, {
                sitekey: import.meta.env.VITE_CF_TURNSTILE_SITEKEY,
                theme: "dark"
            })
        })
    }

    async connectedCallback() {
        super.connectedCallback()
        
        if (await hasUserLogged()) window.location.href = "/dashboard"

        const url = new URL(window.location.href)
        const form = url.searchParams.get("form")
        if (form) requestAnimationFrame(() => this.changeForm(parseInt(form)))
    }

    changeForm(index: number) {
        this.currentForm = index

        const view = this.querySelector("#email-login-view") as HTMLElement
        const slider = this.querySelector("#email-login-slider") as HTMLElement
        slider.style.transform = `translateX(-${index * 100 / 4}%)`
        view.style.height = (slider.children[this.currentForm] as HTMLElement).offsetHeight + "px"

        const url = new URL(window.location.href)
        url.searchParams.set("form", index.toString())
        window.history.replaceState({}, "", url.toString())
    }

    protected render() {
        return html`
            <element-navbar></element-navbar>

            <element-notify-container class="fixed block top-16 w-full md:w-3/4 lg:w-2/3 right-1/2 translate-x-1/2 z-10"></element-notify-container>

            <div class="lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-4xl w-full max-w-md mx-auto mt-24 mb-24 bg-default-card/75 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div>
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-extrabold text-default-primary">MiniQuiz</h1>
                        <p class="text-default-text-sub mt-2">Đăng nhập để tiếp tục</p>
                    </div>

                    <!-- Social login -->
                    <div class="space-y-3">
                        <button @click=${() => {window.location.href = "/api/user/google/login"}} class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-700 hover:border-default-primary-hover transition">
                            <img src="${googleLogo}" alt="Google Logo" class="w-5 h-5" />
                            <span>Đăng nhập với Google</span>
                        </button>

                        <button @click=${() => {window.location.href = "/api/user/discord/login"}} class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-700 hover:border-default-primary-hover transition">
                            <img src="${discordLogo}" alt="Discord Logo" class="w-5 h-5" />
                            <span>Đăng nhập với Discord</span>
                        </button>
                    </div>

                    <!-- Divider -->
                    <div class="flex items-center gap-4 my-8">
                        <div class="flex-1 h-px bg-gray-800"></div>
                        <span class="text-sm text-gray-500">hoặc</span>
                        <div class="flex-1 h-px bg-gray-800"></div>
                    </div>

                    <!-- Form -->
                    <div id="email-login-view" class="w-full overflow-hidden" style="height: 252px">
                        <div id="email-login-slider" class="w-[400%] flex transition-transform ease-in-out duration-500">
                            <element-login_form .turnstileWidgetId="${this.turnstile_widgetId}" class="w-full h-fit"></element-login_form>
                            <element-register_form .turnstileWidgetId="${this.turnstile_widgetId}" class="w-full h-fit"></element-register_form>
                            <element-forgot_passwd_form .turnstileWidgetId="${this.turnstile_widgetId}" class="w-full h-fit"></element-forgot_passwd_form>
                            <element-reset_passwd_form .turnstileWidgetId="${this.turnstile_widgetId}" class="w-full h-fit"></element-reset_passwd_form>
                        </div>
                    </div>

                    <div class="flex items-center justify-center my-5">
                        <div ${ref(this.turnstileRef)}></div>
                    </div>

                    <!-- Footer -->
                    <div class="grid grid-cols-2 divide-gray-800 divide-x-2 text-center text-sm text-gray-500">
                        ${repeat([{i: 0, label: "Đăng nhập"}, {i: 1, label: "Đăng ký"}, {i: 2, label: "Quên mật khẩu"}].filter((item) => item.i !== this.currentForm).slice(0, 2), (item) => item.i, (item) => html`
                            <button @click=${() => requestAnimationFrame(() => this.changeForm(item.i))} class="text-indigo-400 hover:underline">${item.label}</button>
                        `)}
                    </div>
                </div>
                <img src="${auth_illustration}" loading="lazy" alt="Authentication Illustration" class="hidden lg:block w-full h-auto object-contain select-none pointer-events-none" />
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "page-auth": PageAuth
    }
}

declare const turnstile: any;