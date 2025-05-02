export const auth = {
    currentUser: { email: "dev-user@example.com", uid: "dev-uid" },
    signInWithEmailAndPassword: () => Promise.resolve({ user: { email: "test@example.com" } }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { email: "test@example.com" } }),
    signInWithPopup: () => Promise.resolve({ user: { email: "google@example.com" } }),
    signOut: () => Promise.resolve()
  };
  
  export const googleProvider = { providerId: 'google.com' };
  export const analytics = {
    logEvent: () => {}
  };