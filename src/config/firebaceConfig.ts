import * as admin from 'firebase-admin';
import * as serviceAccount from './firebaseServiceAccountKey.json';
// import * as serviceAccount from './firebaseServiceAccountKeyTest.json';
const app: admin.app.App = admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
    })
});
export default app;