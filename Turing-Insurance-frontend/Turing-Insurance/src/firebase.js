import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator,
  GoogleAuthProvider  // Add this import
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHFj7EAdedOucNE-wPNshMMHRXgLOZCG4",
  authDomain: "turing-claim.firebaseapp.com",
  projectId: "turing-claim",
  storageBucket: "turing-claim.appspot.com",
  messagingSenderId: "220569062457",
  appId: "1:220569062457:web:5bf84c00a644ce983e11e8",
  measurementId: "G-NB19FSWK10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();  // Create provider instance

// Connect to emulators in development
if (import.meta.env.MODE === 'development') {
  connectAuthEmulator(auth, "http://127.0.0.1:9098");
  connectFirestoreEmulator(db, "127.0.0.1", 8081);
  connectStorageEmulator(storage, "127.0.0.1", 9198);
  console.log("Connected to all emulators");
}

// Export all needed services
export { auth, db, storage, googleProvider };  // Add googleProvider to exports