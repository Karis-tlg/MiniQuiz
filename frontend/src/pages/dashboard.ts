import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import "../components/icon"
import "../components/navbar"
import "../components/avatar"
import "../components/form/dashboard/tabs"
import { ElementTabsManager } from "../components/form/dashboard/tabs_manager"
import { getUserData } from "../apis/user"

@customElement("page-dashboard")
export class PageDashboard extends LitElement {
    @state() user!: User
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
    }

    render() {
        return html`
            <element-navbar>
                <div slot="right" class="flex items-center gap-x-3">
                    <button class="text-gray-400 hover:text-indigo-500 transition-colors text-2xl w-10 h-10"><element-icon icon="notifications" size="8"></element-icon></button>
                    <element-avatar slot="right" class="w-10 h-10" .avatar_url="${this.user?.avatar}"></element-avatar>
                </div>
            </element-navbar>

            <element-tabs-manager ${ref(this.tabsManagerRef)} .activeTab=${this.currentTab} .tabs=${this.tabs}></element-tabs-manager>

            <main class="mt-14 md:ml-80 lg:ml-80 py-1 px-3">
                <element-tab-overview .hidden=${this.currentTab !== "overview"}></element-tab-overview>
            </main>
        `
    }
}