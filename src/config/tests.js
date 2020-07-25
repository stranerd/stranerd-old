import { firestore, functions } from '@/config/firebase'
import router from '@/router/index'

export const checkForUnfinishedTests = async (id) => {
    let tests = await firestore.collection('tests/tutors/tests')
        .where('user','==', id)
        .where('marked','==',false)
        .limit(1).get()
    if(!tests.empty){
        await router.push(`/tests/tutors/${tests.docs[0].id}`).catch(error => error)
    }
}
export const startTest = async ({ tutor, id: user, course }) => {
    let level = tutor['levels'][course] + 1
    let data = { user, course, level }
    return functions.httpsCallable('startTutorTest')(data).then(async res => {
        await router.push(`/tests/tutors/${res.data.id}`)
    }).catch(error => new window.Toast({ icon: 'error', title: error.message }))
}
export const submitTest = async ({ id, answers }) => {
    return functions.httpsCallable('markTutorTest')({ id, answers }).then(async res => res.data.score)
        .catch(error => new window.Toast({ icon: 'error', title: error.message }))
}
