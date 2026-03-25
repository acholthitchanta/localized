import React, {useContext, useState, useEffect} from 'react'
import { auth, dataConnect } from '../firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, verifyBeforeUpdateEmail} from 'firebase/auth'
import { executeQuery } from '@firebase/data-connect'
import { sha256 } from 'js-sha256'

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    async function signup(email, password, displayName = '') {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // Hash the password for database storage
        const passwordHash = sha256(password)
        
        // Create username from email
        const username = email.split('@')[0]
        
        // Create user record in database
        try {
            const result = await executeQuery(dataConnect, 'CreateUser', {
                username: username,
                email: email,
                passwordHash: passwordHash
            })
            console.log('User created in database:', result)
        } catch (error) {
            console.error('Error creating user in database:', error)
            // User created in Firebase but not in database - consider this non-critical for now
        }
        
        return userCredential
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth,email, password)
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function emailUpdate(email){
        return verifyBeforeUpdateEmail(currentUser, email)

    }

    function passwordUpdate(password){
        return updatePassword(currentUser, password)
    }

    function logout(){
        return signOut(auth)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user) =>{
            setLoading(false)
            setCurrentUser(user)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        emailUpdate,
        passwordUpdate,
        dataConnect
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
