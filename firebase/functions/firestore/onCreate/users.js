const functions = require('firebase-functions')
const algoliaSearch = require('algoliasearch')
const environment = functions.config().environment.mode
const algolia = functions.config().algolia[environment]

module.exports = functions.firestore.document('/users/{id}').onCreate(async (snap, context) => {
	try{
		const client = algoliaSearch(algolia.appId, algolia.apiKey)
		const index = client.initIndex('users')
		let data = { objectId: snap.id, ...snap.data() }
		index.addObject(data)
	}catch(error){
		console.warn(error)
	}
})