import { firestore } from '@/config/firebase'

const state = {
	subjects: []
}

const getters = {
	getAllSubjects: state => state.subjects
}

const mutations = {
	setAllSubjects: (state, subjects) => state.subjects = subjects,
	addSubject: (state, subject) => state.subjects.push(subject),
	deleteSubject: (state, id) => state.subjects = state.subjects.filter(s => s['.key'] !== id),
	editSubject(state, subject){
		let index = state.subjects.findIndex(s => s['.key'] === subject['.key'])
		state.subjects[index].name = subject.name
		state.subjects[index].modules = subject.modules.map(m => m)
	},
}

const actions = {
	async fetchAllSubjects({ commit }){
		let docs = await firestore.collection('subjects').get()
		let subjects = docs.docs.map(doc => ({ ...doc.data(), '.key': doc.id }))
		commit('setAllSubjects', subjects)
	},
	async createSubject({ commit }, subject){
		let doc = await firestore.collection('subjects').add(subject)
		commit('addSubject',{ ...subject, '.key': doc.id })
	},
	async editSubject({ commit }, subject){
		await firestore.collection('subjects').doc(subject['.key']).set(subject)
		commit('editSubject',{ ...subject })
	},
	async deleteSubject({ commit }, id){
		await firestore.collection('subjects').doc(id).delete()
		commit('deleteSubject',id)
	},
	async createModule({ commit }, { subject, module }){
		subject.modules.push(module)
		await firestore.collection('subjects').doc(subject['.key']).set(subject)
		commit('editSubject', { ...subject })
	},
	async editModule({ commit }, { subject, module, updated }){
		let index = subject.modules.findIndex(m => m === module)
		subject.modules[index] = updated
		await firestore.collection('subjects').doc(subject['.key']).set(subject)
		commit('editSubject', { ...subject })
	},
	async deleteModule({ commit }, { subject, module }){
		subject.modules = subject.modules.filter(m => m !== module)
		await firestore.collection('subjects').doc(subject['.key']).set(subject)
		commit('editSubject', { ...subject })
	}
}

export default { state, getters, mutations, actions }