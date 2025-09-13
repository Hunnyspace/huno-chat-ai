import { auth } from './firebaseConfig';
import type { User } from "firebase/auth";

export const signInAgency = (email: string, password: string): Promise<any> => {
    return auth.signInWithEmailAndPassword(email, password);
};

export const signOutAgency = (): Promise<void> => {
    return auth.signOut();
};

export const onAgencyAuthChanged = (callback: (user: User | null) => void): (() => void) => {
    return auth.onAuthStateChanged(callback);
};
