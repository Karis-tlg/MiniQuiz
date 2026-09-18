import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, type Ref } from "lit/directives/ref.js"
import "../components/icon"
import "../components/navbar"
import "../components/notify"
import { ElementEditorSidebar } from"../components/page/editor/sidebar"
import { ElementEditorMultiChoice } from "../components/page/editor/questions/multi_choice"
import { getEditorData, updateQuiz } from "../apis/quiz"
import { hasUserLogged } from "../apis/user"
import { ImagesManager } from "../utils/images-manager"

@customElement("page-editor")
export class PageEditor extends LitElement {
    loadingRef: Ref<HTMLElement> = createRef()
    sidebarRef: Ref<ElementEditorSidebar> = createRef()
    mainRef: Ref<HTMLElement> = createRef()
    questionsRef: Ref<HTMLElement> = createRef()
    private observer?: MutationObserver
    private raf?: number

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async connectedCallback() {
        super.connectedCallback()
        if (!await hasUserLogged()) window.location.href = "/auth"

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

    async firstUpdated() {
        const load_quiz_id = new URLSearchParams(window.location.search).get("quiz")
        const local_data = sessionStorage.getItem("quiz_" + load_quiz_id)
        if (load_quiz_id) {
            const data = local_data ? JSON.parse(local_data) : await getEditorData(load_quiz_id)
            await this.load_json(data)
        } else window.location.href = "/dashboard"
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

    add_question(type: "multi_choice" | "true_false") {
        switch (type) {
            case "multi_choice":
                const question = new ElementEditorMultiChoice()
                this.questionsRef.value?.appendChild(question)
                break
            case "true_false":
                break
        }
        this.save_local()
    }

    async export_json() {
        return {
            "title": this.sidebarRef.value?.get_title(),
            "randomize": {
                "questions": this.sidebarRef.value?.is_random_questions(),
                "options": this.sidebarRef.value?.is_random_options()
            },
            "questions": await Promise.all(Array.from(this.questionsRef.value?.querySelectorAll("element-question-editor-multi_choice") ?? []).map(question => question.export_json()))
        }
    }
    
    async save() {
        this.loadingRef.value?.classList.replace("hidden", "flex")
        const data = await this.export_json()
        sessionStorage.clear()
        const result = await updateQuiz(new URLSearchParams(window.location.search).get("quiz")!, data)
        window.dispatchEvent(new CustomEvent("page-notify", { detail: { message: result.message, duration: 5, type: "success" } }))
        this.loadingRef.value?.classList.replace("flex", "hidden")
    }

    async save_local(data?: any) {
        const quiz_id = new URLSearchParams(window.location.search).get("quiz")
        const save_data = (data ?? await this.export_json())
        save_data["images"] = ImagesManager.images_data
        sessionStorage.setItem("quiz_"+quiz_id, JSON.stringify(save_data))
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

        this.loadingRef.value?.classList.replace("hidden", "flex")
        this.clear_quiz()

        this.sidebarRef.value?.set_title(data.title)
        this.sidebarRef.value?.set_time(0)
        this.sidebarRef.value?.set_random_questions(data.randomize?.questions ?? true)
        this.sidebarRef.value?.set_random_options(data.randomize?.options ?? true)

        ImagesManager.images_data = data.images

        data.questions.forEach((question: any) => {
            const new_question = new ElementEditorMultiChoice()
            new_question.question = question.question
            question.options.forEach((option: any) => new_question.add_option(option.id, option.label, option.id == question.answer))
            this.questionsRef.value?.appendChild(new_question)
        })

        this.updateIndexes()

        this.loadingRef.value?.classList.replace("flex", "hidden")
        this.save_local()
    }

    protected render() {
        return html`
            <div ${ref(this.loadingRef)} class="fixed top-0 left-0 z-250 flex items-center justify-center w-full h-screen bg-black/75 text-default-text">
                <element-icon icon="loading" size="10" class="animate-spin"></element-icon>
            </div>

            <element-navbar href="#">
                <button slot="left" @click=${this.toggle_sidebar} class="lg:hidden text-lg text-default-text hover:text-indigo-500 transition">
                    <element-icon icon="menu"></element-icon>
                </button>
                <div slot="right" class="flex items-center gap-x-3">
                    <button @click="${this.clear_quiz}" class="block px-3 py-1 bg-rose-500 hover:bg-rose-700 rounded-lg transition"><element-icon icon="trash"></element-icon> Đặt lại</button>
                    <button @click="${this.save}" class="block px-3 py-1 bg-indigo-500 hover:bg-indigo-700 rounded-lg transition"><element-icon icon="save"></element-icon> Lưu</button>
                </div>
            </element-navbar>

            <element-notify-container class="fixed block top-16 w-full md:w-3/4 lg:w-2/3 right-1/2 translate-x-1/2 z-120"></element-notify-container>

            <div class="pt-16">
                <element-editor-sidebar ${ref(this.sidebarRef)}></element-editor-sidebar>
                <main ${ref(this.mainRef)} class="md:ml-80 lg:ml-80 p-4">
                    <h1 class="text-2xl font-bold text-default-text mb-4">Danh sách câu hỏi</h1>
                    <div ${ref(this.questionsRef)} class="grid grid-cols-1 gap-4"></div>
                    <div class="w-full flex items-center justify-center mt-3">
                        <div class="group relative py-3 w-4/5 border focus-within:text-indigo-500 border-dashed border-gray-700 hover:border-indigo-500 focus-within:border-indigo-500 rounded-lg text-center transition-colors mt-3" tabindex="0">
                            <span class="group-hover:hidden group-focus-within:hidden text-default-text-sub hover:text-indigo-500"><element-icon icon="add"></element-icon> Thêm câu hỏi</span>
                            <div class="hidden group-hover:grid group-focus-within:grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button @click="${() => this.add_question('multi_choice')}" class="grow text-center h-full text-default-text-sub hover:text-indigo-500 transition"><element-icon icon="list-circle"></element-icon> Câu hỏi nhiều lựa chọn</button>
                                <button @click="${() => this.add_question('true_false')}" class="grow text-center h-full text-default-text-sub hover:text-indigo-500 transition"><element-icon icon="checkmark-circle"></element-icon> Câu hỏi đúng/sai</button>
                            </div>
                        </div>
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