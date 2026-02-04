import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement("element-sidebar")
export class ElementSidebar extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render() {
        return html`
            <aside class="w-80 h-full bg-default-background/50 backdrop-blur-sm border-r border-slate-700 p-4 fixed top-14 left-0 bottom-0">
                <nav class="flex flex-col gap-y-6">
                    <p class="text-default-text text-lg font-semibold tracking-wider uppercase w-full text-center">Cấu hình Quiz</p>

                    <div>
                        <label class="block text-xs text-gray-400 font-semibold mb-2 uppercase">Tiêu đề Quiz</label>
                        <input type="text" placeholder="Tiêu đề gì đó" class="w-full bg-default-card border border-slate-800 rounded-lg px-3 py-2 text-sm text-default-text-sub focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition">
                    </div>

                    <div class="flex items-center justify-between p-3 bg-default-card rounded-lg border border-slate-800">
                        <div>
                            <p class="text-sm font-medium text-default-text">Thời gian (phút)</p>
                            <p class="text-[10px] text-default-text-sub">Đặt 0 để không giới hạn</p>
                        </div>
                        <input type="number" placeholder="0" class="w-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-gray-800 border-none rounded text-center py-1 text-sm font-bold text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500">
                    </div>

                    <label class="flex items-center justify-between cursor-pointer group">
                        <span class="text-sm text-gray-400 group-hover:text-gray-200 transition">Trộn câu hỏi</span>
                        <div class="relative inline-flex items-center">
                            <input type="checkbox" checked class="sr-only peer">
                            <div class="w-9 h-5 bg-default-card border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between cursor-pointer group">
                        <span class="text-sm text-gray-400 group-hover:text-gray-200 transition">Trộn đáp án</span>
                        <div class="relative inline-flex items-center">
                            <input type="checkbox" checked class="sr-only peer">
                            <div class="w-9 h-5 bg-default-card border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                    </label>

                    <div class="relative flex items-center justify-between p-3 bg-default-card border-2 border-slate-800 border-dashed rounded-lg hover:border-indigo-500 transition cursor-pointer">
                        <i class="fa-solid fa-file-upload text-5xl text-gray-400"></i>
                        <p>
                            <span class="text-sm text-indigo-400 mt-2">Tải lên</span>
                            <span class="text-sm text-gray-400 mt-2">hoặc kéo thả file quiz vào đây</span>
                        </p>
                        <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    </div>
                </nav>
            </aside>
        `
    }
}