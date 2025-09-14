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

/**
 * Sends a secure sign-in link to the user's email.
 * @param email - The email address to send the link to.
 * @param redirectUrl - The URL the user will be redirected to after clicking the link.
 */
export const sendSignInLink = (email: string, redirectUrl: string): Promise<void> => {
    const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
    };
    // Store the email in local storage to retrieve it upon return.
    window.localStorage.setItem('emailForSignIn', email);
    return auth.sendSignInLinkToEmail(email, actionCodeSettings);
};

// Fix: The User type is available on the firebase namespace.
export const onAgencyAuthChanged = (callback: (user: firebase.User | null) => void): (() => void) => {
    return auth.onAuthStateChanged(callback);
};