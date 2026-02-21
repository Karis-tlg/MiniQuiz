import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement("element-tab-overview")
export class ElementTabOverview extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    getTimeOfDay() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 11) return "Sáng";
        if (hour >= 11 && hour < 13) return "Trưa";
        if (hour >= 13 && hour < 18) return "Chiều";
        return "Tối";
    }

    protected render() {
        return html`
            <div class="p-4 w-full rounded-lg shadow shadow-gray-800 border border-gray-700">
                <span class="text-sm text-indigo-300"><element-icon icon="leaf"></element-icon> Chào Buổi ${this.getTimeOfDay()}</span>
                <p class="text-lg text-default-text-sub mt-2">Tiếp tục hành trình nào!</p>
                <div class="flex items-center flex-nowarp mt-3">
                    <input class="w-full max-w-lg px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 focus:ring-0" placeholder="Nhập mã tham gia quiz" />
                    <button class="px-5 py-1.5 ml-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"><element-icon icon="arrow-forward"></element-icon></button>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-tab-overview": ElementTabOverview
    }
}