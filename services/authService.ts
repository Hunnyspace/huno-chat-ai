import { auth } from './firebaseConfig';
import firebase from 'firebase/compat/app';
// Fix: The User type is available on the firebase namespace, not as a direct export from 'firebase/compat/auth'.
// import type { User } from 'firebase/compat/auth';


export const signInAgency = (email: string, password: string): Promise<any> => {
    return auth.signInWithEmailAndPassword(email, password);
};

export const signOutAgency = (): Promise<void> => {
    return auth.signOut();
};

// Fix: The User type is available on the firebase namespace.
export const onAgencyAuthChanged = (callback: (user: firebase.User | null) => void): (() => void) => {
    return auth.onAuthStateChanged(callback);
};
