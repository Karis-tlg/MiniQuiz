import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { getQuizList, newQuiz } from '../../../../apis/quiz';
import { repeat } from 'lit/directives/repeat.js';


@customElement('element-tab-editor')
export class ElementTabEditor extends LitElement {
    @state() currentPage: number = 1
    private quizs: { quizzes: { quiz_id: string, title: string, updateAt: Date, question_count: number }[], max_page: number } = { quizzes: [], max_page: 1 }

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async connectedCallback() {
        super.connectedCallback()
        this.quizs = await getQuizList(1)
        this.requestUpdate()
    }

    async changePage(page: number) {
        if (page < 1 || page > this.quizs.max_page) return
        this.currentPage = page
        this.quizs = await getQuizList(page)
        this.requestUpdate()
    }

    protected async createQuiz() {
        const quizId = await newQuiz()
        window.location.href = `/editor?quiz=${quizId}`
    }

    render() {
        return html`
            <div class="flex justify-between items-center mb-4 p-5">
                <h2 class="text-2xl font-bold">Danh sách Quiz</h2>
                <button class="cursor-pointer bg-linear-to-r from-indigo-500 to-blue-500 hover:opacity-75 text-white rounded-lg px-4 py-2" @click=${this.createQuiz}>Tạo mới</button>
            </div>

            <div class="grid grid-cols-1 gap-4">
                ${this.quizs.quizzes.length !== 0 ? repeat(this.quizs.quizzes, quiz => quiz.quiz_id, quiz => html`
                    <div class="flex flex-nowrap gap-4 rounded p-4 bg-gray-800/10 border border-gray-800/75 shadow">
                        <div class="bg-indigo-500/10 w-16 h-16 rounded-lg flex items-center justify-center">
                            <element-icon icon="image" size="8"></element-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-semibold truncate">${quiz.title}</h3>
                            <p class="text-sm text-gray-500 flex flex-wrap gap-x-3">
                                <span>Cập nhật lần cuối: ${new Date(quiz.updateAt).toLocaleString()}</span> 
                                <span>${quiz.question_count} câu hỏi</span>
                            </p>
                        </div>
                        <button class="cursor-pointer ml-auto w-16 h-16 text-gray-400 hover:text-indigo-500 transition-colors" @click=${() => window.location.href = `/editor?quiz=${quiz.quiz_id}`}>
                            <element-icon icon="pen-square" size="8"></element-icon>
                        </button>
                    </div>
                `) : html`
                    <div class="w-full flex items-center justify-center">
                        <element-icon icon="loading" size="10" class="animate-spin text-gray-500"></element-icon>
                    </div>
                `}
            </div>

            <div class="flex justify-center mt-6 gap-x-2 px-4 py-2">
                <button class="px-3 py-1 rounded ${this.currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-indigo-500/50'}" @click=${() => this.changePage(this.currentPage - 1)} ?disabled=${this.currentPage === 1}>
                    <element-icon icon="arrow-back" size="6"></element-icon>
                </button>
                ${Array.from({ length: this.quizs.max_page }, (_, i) => i + 1).map(page => html`
                    <button class="px-3 py-1 rounded ${this.currentPage === page ? 'bg-indigo-500 text-gray-50 hover:text-gray-200' : 'bg-gray-800 hover:bg-gray-500'}" @click=${() => this.changePage(page)}>
                        ${page}
                    </button>
                `)}
                <button class="px-3 py-1 rounded ${this.currentPage === this.quizs.max_page ? 'cursor-not-allowed' : 'hover:text-indigo-500/50'}" @click=${() => this.changePage(this.currentPage + 1)} ?disabled=${this.currentPage === this.quizs.max_page}>
                    <element-icon icon="arrow-forward" size="6"></element-icon>
                </button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-tab-editor": ElementTabEditor
    }
}