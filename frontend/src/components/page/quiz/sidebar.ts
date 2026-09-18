import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"

@customElement("element-quiz-sidebar")
export class ElementQuizSidebar extends LitElement {
    @state() private close = !window.matchMedia('(min-width: 768px)').matches
    @state() questionsDiv?: HTMLElement
    @state() currentQuestion!: number
    sidebarRef: Ref<HTMLElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    is_closed(): boolean {
        return this.close
    }

    toggle() {
        this.close = !this.close
    }

    protected render() {
        const questions = Array.from(this.questionsDiv?.querySelectorAll('element-question-quiz-multi_choice') ?? [])
        return html`
            <aside ${ref(this.sidebarRef)} class="${this.close ? 'hidden' : ''} lg:block w-full md:w-80 select-none fixed top-14 left-0 bottom-0 z-100 h-full overflow-scroll bg-default-background/70 backdrop-blur-md border-r border-slate-700 p-4">
                <nav class="flex flex-col gap-y-6 pb-10">
                    <span class="text-default-text text-lg tracking-wider uppercase w-full text-center">Danh sách câu hỏi</span>
                    <div class="grid grid-cols-5 gap-3 overflow-y-auto">
                        ${questions.map((q, i) => html`
                            <button class="w-full aspect-square flex items-center justify-center text-2xl text-white border border-indigo-500 rounded-lg cursor-pointer ${q.marked ? 'bg-orange-600' : ''} ${q.completed ? 'bg-green-600' : ''} ${this.currentQuestion === i ? 'bg-indigo-600' : 'hover:bg-indigo-500'}" @click="${() => window.dispatchEvent(new CustomEvent('change-question', { detail: i }))}">${i+ 1}</button>
                        `)}
                    </div>
                </nav>
            </aside>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-quiz-sidebar": ElementQuizSidebar
    }
}