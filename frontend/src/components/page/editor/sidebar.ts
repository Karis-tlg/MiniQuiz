import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"

@customElement("element-editor-sidebar")
export class ElementEditorSidebar extends LitElement {
    @state() private close = !window.matchMedia('(min-width: 768px)').matches
    sidebarRef: Ref<HTMLElement> = createRef()
    titleRef: Ref<HTMLInputElement> = createRef()
    timeRef: Ref<HTMLInputElement> = createRef()
    randomQuestionsRef: Ref<HTMLInputElement> = createRef()
    randomOptionsRef: Ref<HTMLInputElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    is_closed(): boolean {
        return this.close
    }

    toggle() {
        this.close = !this.close
    }

    get_title(): string | undefined {
        return this.titleRef.value?.value
    }

    set_title(value: string) {
        this.titleRef.value!.value = value
    }

    get_time(): number | undefined {
        return this.timeRef.value?.valueAsNumber
    }

    set_time(value: number) {
        this.timeRef.value!.valueAsNumber = value
    }

    is_random_questions(): boolean | undefined {
        return this.randomQuestionsRef.value?.checked
    }

    set_random_questions(value: boolean) {
        this.randomQuestionsRef.value!.checked = value
    }

    is_random_options(): boolean | undefined {
        return this.randomOptionsRef.value?.checked
    }

    set_random_options(value: boolean) {
        this.randomOptionsRef.value!.checked = value
    }

    protected render() {
        return html`
            <aside ${ref(this.sidebarRef)} class="${this.close ? 'hidden' : ''} lg:block w-full md:w-80 fixed top-14 left-0 bottom-0 z-100 h-full bg-default-background/70 backdrop-blur-md border-r border-slate-700 p-4">
                <nav class="flex flex-col gap-y-6">
                    <p class="text-default-text text-lg font-semibold tracking-wider uppercase w-full text-center">Cấu hình Quiz</p>

                    <div>
                        <label class="block text-xs text-gray-400 font-semibold mb-2 uppercase">Tiêu đề Quiz</label>
                        <input ${ref(this.titleRef)} type="text" placeholder="Tiêu đề gì đó" class="w-full bg-default-card border border-slate-800 rounded-lg px-3 py-2 text-sm text-default-text-sub focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition">
                    </div>

                    <div class="flex items-center justify-between p-3 bg-default-card rounded-lg border border-slate-800">
                        <div>
                            <p class="text-sm font-medium text-default-text">Thời gian (phút)</p>
                            <p class="text-[10px] text-default-text-sub">Đặt 0 để không giới hạn</p>
                        </div>
                        <input ${ref(this.timeRef)} type="number" placeholder="0" class="w-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-gray-800 border-none rounded text-center py-1 text-sm font-bold text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500">
                    </div>

                    <label class="flex items-center justify-between cursor-pointer group">
                        <span class="text-sm text-gray-400 group-hover:text-gray-200 transition">Trộn câu hỏi</span>
                        <div class="relative inline-flex items-center">
                            <input checked ${ref(this.randomQuestionsRef)} type="checkbox" class="sr-only peer">
                            <div class="w-9 h-5 bg-default-card border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                    </label>

                    <label class="flex items-center justify-between cursor-pointer group">
                        <span class="text-sm text-gray-400 group-hover:text-gray-200 transition">Trộn đáp án</span>
                        <div class="relative inline-flex items-center">
                            <input checked ${ref(this.randomOptionsRef)} type="checkbox" class="sr-only peer">
                            <div class="w-9 h-5 bg-default-card border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                    </label>
                </nav>
            </aside>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'element-editor-sidebar': ElementEditorSidebar
    }
}