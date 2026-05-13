import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { hasUserLogged } from "../apis/user"
import { getQuizData, submitQuiz } from "../apis/quiz"
import "../components/icon"
import "../components/navbar"
import { ElementQuizSidebar } from "../components/page/quiz/sidebar"
import { ElementQuizMultiChoice } from "../components/page/quiz/questions/multi_choice"
import { repeat } from "lit/directives/repeat.js"

@customElement("page-quiz")
export class PageQuiz extends LitElement {
    private quizData: any
    private mainRef: Ref<HTMLElement> = createRef()
    private loadingRef: Ref<HTMLElement> = createRef()
    private questionsRef: Ref<HTMLElement> = createRef()
    private sidebarRef: Ref<ElementQuizSidebar> = createRef()
    @state() currentQuestion: number = 0

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async connectedCallback() {
        super.connectedCallback()
        if (!await hasUserLogged()) window.location.href = "/auth"

        window.addEventListener("beforeunload", (e) => e.preventDefault())

        window.addEventListener("change-question", (e: Event) => {
            this.currentQuestion = (e as CustomEvent).detail
        })
    }

    async firstUpdated() {
        const quizId = new URLSearchParams(window.location.search).get("quiz")
        if (!quizId) window.location.href = "/dashboard"

        this.quizData = await getQuizData(quizId!)
        if (!this.quizData) window.location.href = "/dashboard"
        
        this.requestUpdate()
        this.loadingRef.value!.classList.replace("flex", "hidden")
    }

    toggle_sidebar() {
        requestAnimationFrame(() => {
            this.sidebarRef.value?.toggle()
            this.sidebarRef.value?.is_closed() ? this.mainRef.value?.classList.remove("md:ml-80") : this.mainRef.value?.classList.add("md:ml-80")
        })
    }

    export_json() {
        return {
            quiz_id_version: this.quizData._id,
            answers: Array.from(this.querySelectorAll("element-question-quiz-multi_choice")).map((question: ElementQuizMultiChoice) => question.export_json())
        }
    }

    async submit() {
        this.loadingRef.value!.classList.remove("hidden")
        const data = this.export_json()
        const quiz_id = new URLSearchParams(window.location.search).get("quiz")
        const res = await submitQuiz(quiz_id!, data)
        window.location.href = `/result?result_id=${res.result_id}`
    }

    render() {
        return html`
            <div ${ref(this.loadingRef)} class="fixed top-0 left-0 z-250 flex items-center justify-center w-full h-screen bg-black/75 text-default-text">
                <element-icon icon="loading" size="10" class="animate-spin"></element-icon>
            </div>

            <element-navbar href="#">
                <button slot="left" @click=${this.toggle_sidebar} class="lg:hidden text-lg text-default-text hover:text-indigo-500 transition">
                    <element-icon icon="menu"></element-icon>
                </button>
                <button @click=${this.submit} slot="right" class="block px-3 py-2 bg-indigo-500 hover:bg-indigo-700 rounded-lg transition">
                    <element-icon icon="save"></element-icon> Hoàn thành
                </button>
            </element-navbar>

            <div class="pt-16">
                <element-quiz-sidebar ${ref(this.sidebarRef)} .currentQuestion=${this.currentQuestion} .questionsDiv=${this.questionsRef.value}></element-quiz-sidebar>
                <main ${ref(this.mainRef)} class="w-full md:pl-80">
                    <div ${ref(this.questionsRef)} class="w-full">
                        ${this.quizData && this.currentQuestion < this.quizData.questions.length && this.currentQuestion >= 0 ? repeat(this.quizData.questions, (question: any) => question.id, (question) => html`
                            <element-question-quiz-multi_choice .question=${question} .hidden=${this.currentQuestion !== this.quizData.questions.indexOf(question)}></element-question-quiz-multi_choice>`
                        ) : html``}
                        </div>
                        <div class="w-full flex items-center justify-between mt-3 p-3">
                            <button @click=${() => this.currentQuestion >= 1 && this.currentQuestion--} .disabled=${this.currentQuestion <= 0} class="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600/80 cursor-pointer disabled:cursor-not-allowed disabled:invisible backdrop-blur transition-colors">
                            <span class="hidden md:inline">Câu hỏi trước</span> <element-icon icon="arrow-back"></element-icon>
                        </button>
                        <button @click=${() => this.currentQuestion < (this.quizData?.questions.length - 1 || 0) && this.currentQuestion++} .disabled=${this.currentQuestion >= (this.quizData?.questions.length - 1 || 0)} class="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600/80 cursor-pointer disabled:cursor-not-allowed disabled:invisible backdrop-blur transition-colors">
                            <span class="hidden md:inline">Câu hỏi tiếp theo</span> <element-icon icon="arrow-forward"></element-icon>
                        </button>
                    </div>
                </main>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "page-quiz": PageQuiz
    }
}