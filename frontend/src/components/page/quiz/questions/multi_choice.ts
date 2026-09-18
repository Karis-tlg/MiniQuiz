import { ElementQuizBase } from "./base"
import { html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import { repeat } from "lit/directives/repeat.js"
import "../show_markdown"

@customElement("element-question-quiz-multi_choice-option")
export class ElementQuizMultiChoiceOption extends ElementQuizBase {
    private inputRef: Ref<HTMLInputElement> = createRef()
    @property({ attribute: false }) question_uuid: string = ""
    @property({ attribute: false }) option_id: string = ""
    @property({ attribute: false }) label!: string

    is_checked(): boolean {
        return this.inputRef.value!.checked
    }

    render() {
        return html`
            <label class="clist-item w-full block rounded-lg border border-slate-700 bg-indigo-400/5 hover:border-indigo-500 hover:bg-indigo-500/10 has-[input:checked]:bg-indigo-500/10 has-[input:checked]:border-indigo-500 cursor-pointer p-4">
                <input ${ref(this.inputRef)} type="radio" name="${this.question_uuid}-option" hidden />
                <element-quiz-show-markdown .value=${this.label} class="inline-block"></element-quiz-show-markdown>
            </label>
        `
    }
}

@customElement("element-question-quiz-multi_choice")
export class ElementQuizMultiChoice extends ElementQuizBase {
    @state() marked: boolean = false
    @state() completed: boolean = false
    @property({ attribute: false }) question!: { id: string, question: string, options: Array<{ id: string, label: string }> }

    export_json(): {} {
        return {
            id: this.question.id,
            type: "multi_choice",
            choice: Array.from(this.querySelectorAll("element-question-quiz-multi_choice-option")).find((option: ElementQuizMultiChoiceOption) => option.is_checked())?.option_id
        }
    }

    is_completed() {
        return Array.from(this.querySelectorAll("element-question-quiz-multi_choice-option")).some((option: ElementQuizMultiChoiceOption) => option.is_checked())
    }

    render() {
        return html`
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                <div class="w-full flex flex-col p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-semibold">Câu hỏi</span>
                        <button @click="${() => this.marked = !this.marked}" title="Đánh dấu" class="${this.marked ? "text-indigo-500" : "text-default-text-sub hover:text-indigo-300"} transition-colors">
                            <element-icon icon="bookmark" size="8"></element-icon>
                        </button>
                    </div>
                    <div class="w-full rounded-lg bg-linear-to-t from-default-card/85 to-default-card backdrop-blur-2xl p-4 h-fit">
                        <element-quiz-show-markdown .value=${this.question.question}></element-quiz-show-markdown>
                    </div>
                </div>
                <div @click=${() => this.completed = this.is_completed()} class="clist list-[upper-alpha] w-full p-4 mt-3 md:mt-8 flex flex-col gap-3">
                    ${repeat(this.question.options, (option) => option.id, (option) => html`
                        <element-question-quiz-multi_choice-option .question_uuid=${this.question.id} .option_id=${option.id} .label=${option.label}></element-question-quiz-multi_choice-option>
                    `)}
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-question-quiz-multi_choice": ElementQuizMultiChoice
        "element-question-quiz-multi_choice-option": ElementQuizMultiChoiceOption
    }
}