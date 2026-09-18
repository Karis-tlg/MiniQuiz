import { Marked, Renderer } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"
import MarkedKatex from "marked-katex-extension"
import DOMPurify from "dompurify"

export class Markdown{
    private marked: Marked

    constructor() {
        this.marked = new Marked()
        this.marked.use(markedHighlight({highlight: (code: string, lang: string) => lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value}))
        this.marked.use(MarkedKatex({throwOnError: false, nonStandard: true}))
    }

    async parseMarkdownAsync(markdown: string): Promise<string> {
        const renderer = new Renderer({async: true, gfm: true, breaks: true})
        renderer.image = ({ href, title, text }) => {
            if (href.startsWith("http")) return `<img src="${href}" alt="${text}" title="${title || ''}" class="w-6/10 mx-auto" />`
            return `<img data-image="${href}" alt="${text}" title="${title || ''}" class="w-6/10 mx-auto" />`
        }
        const html = await this.marked.parse(markdown, { async: true, gfm: true, breaks: true, renderer })
        return DOMPurify.sanitize(html, {
            ADD_ATTR: ['data-image'],
            ADD_URI_SAFE_ATTR: ['data-image'],
            ALLOWED_URI_REGEXP: /^(?:(?:https?|blob|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        })
    }
}
