import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import "../components/icon"
import "../components/navbar"
import "../components/avatar"
import "../components/page/dashboard/tabs"
import { ElementTabsManager } from "../components/page/dashboard/tabs_manager"
import { getUserData } from "../apis/user"
import { getQuizStats } from "../apis/quiz"

@customElement("page-dashboard")
export class PageDashboard extends LitElement {
    private user!: User | null
    private quizStats!: { created: number, done: number }
    private tabsManagerRef: Ref<ElementTabsManager> = createRef()

    private tabs: Array<{ id: string, icon: string, name: string } | { id: string }> = [
        { id: "overview", icon: "stats-chart", name: "Tổng quan" },
        { id: "editor", icon: "pen-square", name: "Quiz của tôi" },
        { id: "history", icon: "layers", name: "Lịch sử bài làm" },
        { id: "explore", icon: "search", name: "Khám phá" },
        { id: "split" },
        { id: "account", icon: "user", name: "Tài khoản" }
    ]

    @state() currentTab: string = "overview"
    
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async connectedCallback() {
        super.connectedCallback()

        window.addEventListener("change-tab", (e: Event) => {
            this.currentTab = (e as CustomEvent).detail
        })

        this.user = await getUserData()
        if (!this.user) window.location.href = "/auth"

        this.quizStats = await getQuizStats()
        this.requestUpdate()
    }

    render_tab() {
        switch (this.currentTab) {
            case "overview":
                return html`<element-tab-overview .stats=${this.quizStats}></element-tab-overview>`
            case "editor":
                return html`<element-tab-editor></element-tab-editor>`
            case "history":
                return html`<element-tab-history></element-tab-history>`
            case "explore":
                return html`<element-tab-explore></element-tab-explore>`
            case "account":
                return html`<element-tab-account .stats=${this.quizStats} .user=${this.user!}></element-tab-account>`
        }
    }

    render() {
        return html`
            <element-navbar>
                <div slot="right" class="flex items-center gap-x-3">
                    <button class="text-gray-400 hover:text-indigo-500 transition-colors text-2xl w-10 h-10"><element-icon icon="notifications" size="8"></element-icon></button>
                </div>
            </element-navbar>

            <element-tabs-manager ${ref(this.tabsManagerRef)} .activeTab=${this.currentTab} .tabs=${this.tabs}></element-tabs-manager>

            ${this.user && this.quizStats ? html`
                <main class="mt-14 md:ml-80 lg:ml-80 py-1 px-3">
                    ${this.render_tab()}
                </main>
                ` : html`
                <div class="w-full h-screen flex items-center justify-center">
                    <element-icon icon="loading" size="10" class="animate-spin text-gray-500"></element-icon>
                </div>
                `
            }
        `
    }
}