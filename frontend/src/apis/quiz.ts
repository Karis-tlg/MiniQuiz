
export async function getQuizEditorData(id: string) {
    return await fetch(`/api/quizzes/${id}/editor`).then(res => res.json())
}

export async function getQuizData(id: string) {
    return await fetch(`/api/quizzes/${id}/data`).then(res => res.json())
}

export async function uploadImage(file: File) {
    const form = new FormData()
    form.append('file', file)
    return await fetch(`/api/quizzes/upload/image`, { method: "POST", body: form, credentials: 'include' }).then(res => res.json())
}

export async function newQuiz(data: any) {
    return await fetch(`/api/quizzes/new`, { method: "POST", body: JSON.stringify(data), credentials: 'include', headers: { 'Content-Type': 'application/json' } }).then(res => res.json())
}

export async function updateQuiz(id: string, data: any) {
    return await fetch(`/api/quizzes/${id}/update`, { method: "POST", body: JSON.stringify(data) }).then(res => res.json())
}

export async function deleteQuiz(id: string) {
    return await fetch(`/api/quizzes/${id}/delete`, { method: "POST" }).then(res => res.json())
}
