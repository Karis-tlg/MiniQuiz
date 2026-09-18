import { ElementEditorBase } from "./base"
import { html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"
import { type ElementEditorInputMarkdown } from "../input_markdown"
import { ImagesManager } from "../../../../utils/images-manager"

@customElement("element-question-editor-multi_choice-option")
export class ElementEditorMultiChoiceOption extends ElementEditorBase {
    private labelRef: Ref<ElementEditorInputMarkdown> = createRef()
    private valueRef: Ref<HTMLInputElement> = createRef()

    @property({ type: String }) uuid: string = crypto.randomUUID()
    @property({ type: String }) label_value: string = ""
    @property({ type: Boolean }) value_checked: boolean = false

    async export_json() {
        await this.updateComplete
        return {
            "id": this.uuid,
            "label": this.labelRef.value?.get_value()
        }
    }

    get_id(): string {
        return this.uuid
    }

    is_correct(): boolean {
        return this.valueRef.value?.checked ?? false
    }

    render() {
        return html`
            <div class="flex items-center w-full">
                <input .checked="${this.value_checked}" type="radio" class="text-default-primary bg-gray-800 form-radio mr-3 w-4 h-4" ${ref(this.valueRef)} />
                <element-editor-input_markdown value="${this.label_value}" ${ref(this.labelRef)} minHeight="2" class="w-full"></element-editor-input_markdown>
                <button @click="${this.remove}" class="text-default-text-sub hover:text-red-500 transition-colors ml-3"><element-icon icon="close"></element-icon></button>
            </div>
        `
    }
}

@customElement("element-question-editor-multi_choice")
export class ElementEditorMultiChoice extends ElementEditorBase {
    @property({ type: Number }) index: number = 0
    @property({ type: String }) question: string = ""

    private questionRef: Ref<ElementEditorInputMarkdown> = createRef()
    private optionsRef: Ref<HTMLDivElement> = createRef()

    async export_json() {
        await this.updateComplete
        const options = Array.from(this.optionsRef.value?.querySelectorAll("element-question-editor-multi_choice-option") ?? []) as ElementEditorMultiChoiceOption[]
        return {
            "id": crypto.randomUUID(),
            "type": "multi_choice",
            "question": this.questionRef.value?.get_value(),
            "options": await Promise.all(options.map(option => option.export_json())),
            "answer": options.find(option => option.is_correct())?.get_id()
        }
    }

    async add_image(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        const fileID = await ImagesManager.saveImage(file)
        this.questionRef.value?.add_line(`![${file.name}](${fileID})`)
    }

    async add_option(id?: string, label?: string, correct?: boolean) {
        const option = new ElementEditorMultiChoiceOption()
        if (id) option.uuid = id
        option.label_value = label ?? ""
        option.value_checked = correct ?? false
        
        await this.updateComplete
        this.optionsRef.value!.appendChild(option)
    }

    render() {
        return html`
            <div class="bg-default-card p-6 rounded-2xl border border-gray-800">
                <div class="w-full flex items-center justify-between mb-5">
                    <p class="text-gray-400 font-semibold uppercase">
                        <span class="inline-block rounded-full w-6.5 h-6.5 bg-indigo-500 text-center text-gray-100 mr-2">${this.index}</span> Câu hỏi nhiều lựa chọn
                    </p>
                    <div>
                        <label class="text-default-text-sub hover:text-indigo-500 transition-colors mr-3">
                            <element-icon icon="image"></element-icon>
                            <input type="file" accept="image/*" class="hidden" @change="${this.add_image}">
                        </label>
                        <button @click="${this.remove}" class="text-default-text-sub hover:text-red-500 transition-colors"><element-icon icon="trash"></element-icon></button>
                    </div>
                </div>

                <element-editor-input_markdown ${ref(this.questionRef)} value="${this.question}" minHeight="4"></element-editor-input_markdown>

                <div class="mb-2 mt-4">
                    <p class="text-default-text-sub uppercase text-sm font-semibold mt-4">Đáp án</p>
                    <div ${ref(this.optionsRef)} class="grid grid-cols-1 gap-2 my-2"></div>
                    <button @click="${this.add_option}" class="text-default-text-sub hover:text-indigo-500 transition-colors mt-3">
                        <element-icon icon="add"></element-icon> Thêm đáp án
                    </button>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-question-editor-multi_choice": ElementEditorMultiChoice
        "element-question-editor-multi_choice-option": ElementEditorMultiChoiceOption
    }
}