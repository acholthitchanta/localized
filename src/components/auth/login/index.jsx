import React from "react";

import { useAuth } from "../../../contexts/authContext";

const Login = () =>{
    const {userLoggedIn} = useAuth('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = usState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async(e) => {
        e.preventDefault() 
        if(!isSigningIn){
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
        }
    }

    const onGoogleSignIn = (e) =>{
        e.preventDefault()
        if(!isSigningIn){
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err =>{
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={`/home`} replace={true} />)}
        </div>
    )

}