import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"
import { Markdown } from "../../../utils/markdown"

@customElement("element-editor-input_markdown")
export class ElementEditorInputMarkdown extends LitElement {
    @property() minHeight: string = "8rem"

    private textareaRef: Ref<HTMLTextAreaElement> = createRef()
    private previewRef: Ref<HTMLDivElement> = createRef()

    private markdownParser: Markdown = new Markdown()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected auto_resize(event: InputEvent) {
        const textarea = event.currentTarget as HTMLTextAreaElement
        textarea.style.height = "auto"
        requestAnimationFrame(() => textarea.style.height = textarea.scrollHeight + "px")
    }

    protected render_markdown() {
        this.previewRef.value!.classList.add("animate-pulse")
        this.markdownParser.parseMarkdownAsync(this.textareaRef.value!.value).then((html: string) => {
            this.previewRef.value!.innerHTML = html
            this.previewRef.value!.classList.remove("animate-pulse")
        })
    }

    protected toggle_textarea() {
        this.previewRef.value?.classList.add("hidden")
        this.textareaRef.value?.classList.remove("hidden")
        this.textareaRef.value?.focus()
    }

    protected leave_textarea() {
        this.previewRef.value?.classList.remove("hidden")
        this.textareaRef.value?.classList.add("hidden")
    }

    protected get_value(): string {
        return this.textareaRef.value!.value
    }

    protected set_value(value: string) {
        this.textareaRef.value!.value = value
        this.render_markdown()
    }

    protected render() {
        return html`
            <div class="w-2/3 mx-auto mt-24">
                <textarea ${ref(this.textareaRef)} style="min-height: ${this.minHeight}" @input="${(event: InputEvent) => this.auto_resize(event)}" @change="${() => this.render_markdown()}" @blur="${() => this.leave_textarea()}" class="w-full resize-none p-4 overflow-y-hidden overflow-x-auto rounded bg-slate-800 border border-slate-700 focus:border-default-primary outline-none transition"></textarea>
                <div ${ref(this.previewRef)} style="min-height: ${this.minHeight}" @click="${() => this.toggle_textarea()}" id="preview" class="markdown-body hidden mt-4 p-4 bg-slate-800 border border-slate-700 rounded"></div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-editor-input_markdown": ElementEditorInputMarkdown
    }
}
