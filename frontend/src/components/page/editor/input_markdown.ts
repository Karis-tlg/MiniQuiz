import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"
import { Markdown } from "../../../utils/markdown"
import { ImagesManager } from "../../../utils/images-manager"

@customElement("element-editor-input_markdown")
export class ElementEditorInputMarkdown extends LitElement {
    @property({ type: Number }) minHeight: number = 5
    @property({ type: String }) value: string = ""

    private textareaRef: Ref<HTMLTextAreaElement> = createRef()
    private previewRef: Ref<HTMLDivElement> = createRef()

    private markdownParser: Markdown = new Markdown()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected firstUpdated(): void {
        this.set_value(this.value)
    }

    auto_resize(event?: InputEvent, force: boolean = false) {
        if (!force && event && (event.inputType !== "deleteContentBackward" && event.inputType !== "insertLineBreak")) return
        const textarea = this.textareaRef.value!
        textarea.style.height = "auto"
        textarea.style.height = textarea.scrollHeight + "px"
    }

    async checkImages() {
        const markdownText = this.textareaRef.value!.value
        const images = await ImagesManager.getAllImages()
        for (const fileID in images) {
            if (!markdownText.includes(fileID)) {
                await ImagesManager.deleteImage(fileID)
            }
        }
    }

    async render_markdown() {
        this.previewRef.value!.classList.add("animate-pulse")
        this.markdownParser.parseMarkdownAsync(this.textareaRef.value!.value).then((html: string) => {
            this.previewRef.value!.innerHTML = html
            this.querySelectorAll("img[data-image]").forEach(async (img) => {
                const imgElement = img as HTMLImageElement
                const src = imgElement.getAttribute("data-image")!
                const image = await ImagesManager.getImage(src)
                if (image) {
                    let srcUrl: string
                    if (image instanceof Object) {
                        srcUrl = URL.createObjectURL(image.file)
                        imgElement.onload = () => URL.revokeObjectURL(srcUrl)
                    } else srcUrl = image

                    imgElement.setAttribute("src", srcUrl)
                    imgElement.removeAttribute("data-image")
                }
            })
            this.previewRef.value!.classList.remove("animate-pulse")
        })
    }

    toggle_textarea() {
        this.previewRef.value?.classList.add("hidden")
        this.textareaRef.value?.classList.remove("hidden")
        this.auto_resize(undefined, true)
        this.textareaRef.value?.focus()
    }

    leave_textarea() {
        this.previewRef.value?.classList.remove("hidden")
        this.textareaRef.value?.classList.add("hidden")
    }

    add_line(content: string) {
        this.textareaRef.value!.value += `\n${content}`
        this.render_markdown()
    }

    get_value(): string | undefined {
        return this.textareaRef.value?.value
    }

    set_value(value: string) {
        this.textareaRef.value!.value = value
        this.render_markdown()
    }

    protected render() {
        return html`
            <div class="w-full">
                <textarea ${ref(this.textareaRef)} name="input_markdown" style="min-height: ${this.minHeight}rem" @input="${(event: InputEvent) => this.auto_resize(event)}" @blur="${() => { this.render_markdown(); this.leave_textarea() }}" class="hidden w-full resize-none p-4 overflow-y-hidden overflow-x-auto rounded bg-slate-800 border border-slate-700 focus:border-default-primary outline-none transition"></textarea>
                <div ${ref(this.previewRef)} style="min-height: ${this.minHeight}rem" @click="${() => this.toggle_textarea()}" class="markdown-body p-4 bg-slate-800 border border-slate-700 rounded"></div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-editor-input_markdown": ElementEditorInputMarkdown
    }
}
