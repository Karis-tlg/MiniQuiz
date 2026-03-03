export async function getQuizStats() {
    const data = await fetch(`/api/quizzes/stats`, { credentials: 'include' }).then(res => res.json())
    return { created: data.quiz_created, done: data.quiz_done }
}

export async function newQuiz() {
    const data = await fetch(`/api/quizzes/new`, { method: 'POST', credentials: 'include' }).then(res => res.json())
    return data.quiz_id
}

export async function updateQuiz(quizId: string, data: any) {
    const result = await fetch(`/api/quizzes/${quizId}/update`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json())
    return result
}

export async function getQuizList(page: number) {
    const data = await fetch(`/api/quizzes/page/${page}`, { credentials: 'include' }).then(res => res.json())
    return { quizzes: data.quizzes, max_page: data.max_page }
}

export async function getEditorData(quizId: string) {
    const data = await fetch(`/api/quizzes/${quizId}/editor`, { credentials: 'include' }).then(res => res.json())
    return data.data
}