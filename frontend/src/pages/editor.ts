import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"
import "../components/navbar"
import { ElementSidebar } from"../components/form/editor/sidebar"
import { ElementEditorMultiChoice } from "../components/form/editor/questions/multi_choice/editor"
import { getQuizEditorData } from "../apis/quiz"
import { getUserData } from "../apis/user"

@customElement("page-editor")
export class PageEditor extends LitElement {
    sidebarRef: Ref<ElementSidebar> = createRef()
    mainRef: Ref<HTMLElement> = createRef()
    questionsRef: Ref<HTMLElement> = createRef()

    private observer?: MutationObserver
    private raf?: number

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async connectedCallback() {
        super.connectedCallback()
        if (!(await getUserData()).email) window.location.href = "/auth"
    }

    firstUpdated() {
        const local_data = sessionStorage.getItem("quiz")
        const load_quiz_id = new URLSearchParams(window.location.search).get("quiz")
        if (load_quiz_id) getQuizEditorData(load_quiz_id).then(data => requestAnimationFrame(() => this.load_json(data)))
        else if (local_data) requestAnimationFrame(() => this.load_json(JSON.parse(local_data)))

        window.addEventListener("beforeunload", (e) => {
            e.preventDefault()
        })

        window.addEventListener("load_json_quiz", (e: Event) => {
            const data = (e as CustomEvent).detail as any
            requestAnimationFrame(() => this.load_json(data))
        })

        this.observer = new MutationObserver(() => {
            if (this.raf) {
                cancelAnimationFrame(this.raf)
            }
            this.raf = requestAnimationFrame(() => {
                this.updateIndexes()
                this.raf = undefined
            })
        })

        this.observer.observe(this.questionsRef.value!, {
            childList: true
        })
    }

    updateIndexes() {
        const children = Array.from(this.questionsRef.value!.children) as ElementEditorMultiChoice[];
        children.forEach((child, i) => {
            if (child.index === i+1) {
                return
            }
            child.index = i+1
            child.requestUpdate()
        });
    }

    toggle_sidebar() {
        requestAnimationFrame(() => {
            this.sidebarRef.value?.toggle()
            this.sidebarRef.value?.is_closed() ? this.mainRef.value?.classList.remove("md:ml-80") : this.mainRef.value?.classList.add("md:ml-80")
        })
    }

    add_question() {
        const question = new ElementEditorMultiChoice()
        this.questionsRef.value?.appendChild(question)
        this.save_local()
    }

    async export_json() {
        return {
            "id": crypto.randomUUID(),
            "title": this.sidebarRef.value?.get_title(),
            "randomize": {
                "questions": this.sidebarRef.value?.is_random_questions(),
                "options": this.sidebarRef.value?.is_random_options()
            },
            "questions": await Promise.all(Array.from(this.questionsRef.value?.querySelectorAll("element-question-editor-multi_choice") ?? []).map(question => question.export_json()))
        }
    }

    async save_local() {
        sessionStorage.setItem("quiz", JSON.stringify(await this.export_json()))
    }

    clear_quiz() {
        this.sidebarRef.value?.set_title("")
        this.sidebarRef.value?.set_time(0)
        this.sidebarRef.value?.set_random_questions(true)
        this.sidebarRef.value?.set_random_options(true)

        this.questionsRef.value!.innerHTML = ""
        this.save_local()
    }

    async load_json(data: any) {
        await this.updateComplete
        this.clear_quiz()

        this.sidebarRef.value?.set_title(data.title)
        this.sidebarRef.value?.set_time(0)
        this.sidebarRef.value?.set_random_questions(data.randomize?.questions ?? true)
        this.sidebarRef.value?.set_random_options(data.randomize?.options ?? true)

        data.questions.forEach((question: any) => {
            const new_question = new ElementEditorMultiChoice()
            new_question.question = question.question
            question.options.forEach((option: any) => new_question.add_option(option.id, option.label, option.id == question.answer))
            this.questionsRef.value?.appendChild(new_question)
        })

        this.save_local()
    }

    protected render() {
        return html`
            <element-navbar href="#">
                <button slot="left" @click=${this.toggle_sidebar} class="lg:hidden text-lg text-default-text hover:text-indigo-500 transition"><i class="fa-solid fa-bars"></i></button>
                <div slot="right" class="flex items-center gap-x-3">
                    <button @click="${this.clear_quiz}" class="px-3 py-1 bg-rose-500 hover:bg-rose-700 rounded-lg transition"><i class="fa-solid fa-trash"></i> Đặt lại</button>
                    <button class="px-3 py-1 bg-indigo-500 hover:bg-indigo-700 rounded-lg transition"><i class="fa-solid fa-floppy-disk"></i> Lưu</button>
                </div>
            </element-navbar>

            <div class="pt-16">
                <element-sidebar ${ref(this.sidebarRef)}></element-sidebar>
                <main ${ref(this.mainRef)} class="md:ml-80 lg:ml-80 p-4">
                    <h1 class="text-2xl font-bold text-default-text mb-4">Danh sách câu hỏi</h1>
                    <div ${ref(this.questionsRef)} class="grid grid-cols-1 gap-4"></div>
                    <div class="w-full flex items-center justify-center mt-3">
                        <button @click="${this.add_question}" class="py-3 w-4/5 text-default-text-sub hover:text-indigo-500 border border-dashed border-gray-700 hover:border-indigo-500 rounded-lg text-center transition-colors mt-3">
                            <i class="fa-solid fa-plus"></i> Thêm câu hỏi
                        </button>
                    </div>
                </main>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "page-editor": PageEditor
    }
}