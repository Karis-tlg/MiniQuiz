
export async function getQuizEditorData(id: string) {
    return await fetch(`/api/quiz/${id}/editor`).then(res => res.json())
}

export async function getQuizData(id: string) {
    return await fetch(`/api/quiz/${id}/data`).then(res => res.json())
}

export async function newQuiz(data: any) {
    return await fetch(`/api/quiz/new`, { method: "POST", body: JSON.stringify(data) }).then(res => res.json())
}

export async function updateQuiz(id: string, data: any) {
    return await fetch(`/api/quiz/${id}/update`, { method: "POST", body: JSON.stringify(data) }).then(res => res.json())
}

export async function deleteQuiz(id: string) {
    return await fetch(`/api/quiz/${id}/delete`, { method: "POST" }).then(res => res.json())
}