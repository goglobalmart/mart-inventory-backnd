import app from '../config/firebaceConfig';
const authCheck = async (req: string) => {
    const currentUser = await app.auth().verifyIdToken(req);
    return currentUser;
}
export default authCheck;  