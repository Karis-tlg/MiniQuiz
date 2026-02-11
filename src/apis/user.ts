
export async function getQuizzes() {
    return await fetch(`/api/quiz`).then(res => res.json())
}