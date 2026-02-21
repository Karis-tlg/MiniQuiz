import { Marked } from "marked"
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
    
    parseMarkdown(markdown: string): string {
        const html = this.marked.parse(markdown, { async: false, gfm: true, breaks: true })
        return DOMPurify.sanitize(html)
    }

    async parseMarkdownAsync(markdown: string): Promise<string> {
        const html = await this.marked.parse(markdown, { async: true, gfm: true, breaks: true })
        return DOMPurify.sanitize(html)
    }
}
