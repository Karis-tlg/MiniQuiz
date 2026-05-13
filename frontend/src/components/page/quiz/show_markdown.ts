import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"
import { Markdown } from "../../../utils/markdown"
import { ImagesManager } from "../../../utils/images-manager"

@customElement("element-quiz-show-markdown")
export class ElementQuizShowMarkdown extends LitElement {
    @property({ attribute: false }) value: string = ""
    private showRef: Ref<HTMLDivElement> = createRef()
    private markdownParser: Markdown = new Markdown()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected updated() {
        this.render_markdown()
    }

    async render_markdown() {
        this.showRef.value!.classList.add("animate-pulse")
        this.markdownParser.parseMarkdownAsync(this.value).then((html: string) => {
            this.showRef.value!.innerHTML = html
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
            this.showRef.value!.classList.remove("animate-pulse")
        })
    }

    protected render() {
        return html`
            <div ${ref(this.showRef)} class="w-full markdown-body"></div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-quiz-show-markdown": ElementQuizShowMarkdown
    }
}