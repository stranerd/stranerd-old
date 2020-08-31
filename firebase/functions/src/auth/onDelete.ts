import functions from 'firebase-functions'
import admin from 'firebase-admin'

module.exports = functions.auth.user().onDelete(async (user) => {
	await admin.firestore().collection('users').doc(user.uid)
		.set({
			dates: { deletedAt: admin.firestore.FieldValue.serverTimestamp() },
		},{ merge: true })
})
