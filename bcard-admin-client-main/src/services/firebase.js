import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, where, query, getDocs} from 'firebase/firestore'
import "firebase/compat/auth";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDnrcCHZp59E11ns89hM-a1Xl9953sP6Lw",
  authDomain: "fir-auth-e51d2.firebaseapp.com",
  projectId: "fir-auth-e51d2",
  storageBucket: "fir-auth-e51d2.appspot.com",
  messagingSenderId: "424293883684",
  appId: "1:424293883684:web:a5a57c72a0b9fef6915db1",
  measurementId: "G-89JHL0G2WG"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let firebase = app;   // var for export

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const auth = getAuth(app);
auth.languageCode = 'en';// firebase.auth().useDeviceLanguage;    // for reCAPTCHA

export default firebase;

export const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const userRef = collection(db, "users");
    const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
    if (result.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    alert(err.message);
  }
};

export const signInWithPhoneNumber = async (auth, phoneNumber, appVerifier) => {

  await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS Sent.Prompt usser to type the code from the message, then sign in user with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // .. 
    }).catch((error) => {
      // Error; SMS not sent
      //...
    });

};

  // try {
    // const res = await auth.signInWithPopup(provider);
    // const user = res.user;
    // const userRef = collection(db, "users");
    // const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
    // if (result.empty) {
    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  // } catch (err) {
    // alert(err.message);
  // }
// };

export const signInWithEAndP = async (email, password) => {

  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      console.log(email, password);
      // Signed in 
      const user = userCredential.user;
      // ...
      console.log(user);

      return user.email;        // this fails to trigger a send back to the front end 

      // const response = await fetch('/api/users');
      // return await response.json();

    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });

    return "hello";

};

export const createUserWithEAndP = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      console.log(email, password)
      // Signed in 
      const user = userCredential.user;
      // ...
      console.log(user);    // pass back user Object? - already hapening
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);

      // ..
    });

  } catch (err) {
    alert(err.message);
  }

  return "userCreated";
  
};

export const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  auth.signOut();
  alert("Bye");
  window.location.reload(false);
};