import { ImagesManager } from "../utils/images-manager"

export async function getQuizStats() {
    const data = await fetch(`/api/quizzes/stats`, { credentials: 'include' }).then(res => res.json())
    return { created: data.quiz_created, done: data.quiz_done }
}

export async function newQuiz() {
    const data = await fetch(`/api/quizzes/new`, { method: 'POST', credentials: 'include' }).then(res => res.json())
    return data.quiz_id
}

export async function updateQuiz(quizId: string, data: any) {
    const form = new FormData()
    const images = await ImagesManager.getAllImages()
    form.append("data", JSON.stringify(data))
    images.forEach(image => form.append("images", image.file))

    const result = await fetch(`/api/quizzes/${quizId}/update`, { method: 'POST', credentials: 'include', body: form }).then(res => res.json())
    ImagesManager.clearImages()
    return result
}

export async function getQuizList(page: number) {
    const data = await fetch(`/api/quizzes/page/${page}`, { credentials: 'include' }).then(res => res.json())
    return { quizzes: data.quizzes, max_page: data.max_page }
}

export async function getQuizData(quizId: string) {
    const data = await fetch(`/api/quizzes/${quizId}/quiz`, { credentials: 'include' }).then(res => res.json())
    return data.data
}
export async function getEditorData(quizId: string) {
    const data = await fetch(`/api/quizzes/${quizId}/editor`, { credentials: 'include' }).then(res => res.json())
    return data.data
}

export async function submitQuiz(quizId: string, data: any) {
    try {
        const result = await fetch(`/api/quizzes/${quizId}/submit`, { method: 'POST', credentials: 'include', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }).then(res => res.json())
        return result
    } catch (error: any) {
        if (error.response.status === 422) {
            throw new Error(error.response.data.detail)
        }
        throw error
    }
}
