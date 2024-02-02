import { initializeApp } from 'firebase/app'
import {
    collection,
    getFirestore,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCeGpZcEW_do4Qrq0SbzApkvJm1WOGr0EA",
    authDomain: "fir-9-new-b72b7.firebaseapp.com",
    projectId: "fir-9-new-b72b7",
    storageBucket: "fir-9-new-b72b7.appspot.com",
    messagingSenderId: "424960716449",
    appId: "1:424960716449:web:67cf93a01ee1decebe8ae0"
};

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt'))

// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id})
    })
    console.log(books)
})

// add documents
const addBooksForm = document.querySelector('.add')
addBooksForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBooksForm.title.value,
        author: addBooksForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBooksForm.reset()
    })
})

// delete documents
const deleteBooksForm = document.querySelector('.delete')
deleteBooksForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBooksForm.id.value)

    deleteDoc(docRef)
      .then(() => {
        deleteBooksForm.reset()
      })
})

// get a single document
const docRef = doc(db, 'books', 'Sgt8s1bXYLnuOvaM0YmY')

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

// update documents
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateForm.reset()
    })
})

// sign up user
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('user created: ', cred.user)
        signupForm.reset()
      })
      .catch((err) => {
        console.log(err.message)
      })
})

// login & logout
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        // console.log('the user Signed out!')
    })
      .catch((err) => {
        console.log(err.message)
      })
})

const loginForm = document.querySelector('.logout')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        // console.log('user Logged in: ', cred.user)
      })
      .catch((err) => {
        console.log(err.message)
      })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
})

// unsubcribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubcribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})