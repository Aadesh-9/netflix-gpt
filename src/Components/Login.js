import { useRef, useState } from "react";
import SignInValidation from "../Utils/SignInValidation";
import SignUpValidation from "../Utils/SignUpValidation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import Header from "./Header";

const Login = () => {
  const dispatch = useDispatch();
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [rememberMe, SetRememberMe] = useState(true);
  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [signInError, setSignInError] = useState(null);

  const clickHandler = () => {
    if (!isSignInForm) {
      const message = SignUpValidation(
        name.current.value,
        email.current.value,
        password.current.value
      );
      setErrorMessage(message);
      if (message) return;
    } else {
      const message = SignInValidation(
        email.current.value,
        password.current.value
      );
      setErrorMessage(message);
      if (message) return;
    }

    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          updateProfile(auth.currentUser, {
            displayName: name.current.value,
            photoURL: "https://avatars.githubusercontent.com/u/121669380?v=4",
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "  -  " + errorMessage);
          setSignInError(
            "Oops !! Your password does not match with email , please  .. Check your email and password ."
          );
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "  -  " + errorMessage);
          setSignInError(
            "Oops !! Your password does not match with email , please  .. Check your email and password ."
          );
        });
    }
  };

  const rememberMeHandler = () => {
    SetRememberMe(!rememberMe);
  };

  const signUpSignInHandler = (e) => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div className="m-0 p-0">
      <Header />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="inset-x-[35%] inset-y-[10%] absolute bg-black w-[450px] h-[600px] text-white  bg-opacity-80"
      >
        <h1 className="p-3 mx-[60px] mt-10 text-3xl font-bold m-2">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            ref={name}
            className="py-7 px-4 mx-[73px] w-[300px] h-[50px] rounded-md border-[1px] border-slate-700 bg-slate-700 "
            type="Name"
            name="Name"
            placeholder="Full Name"
          ></input>
        )}
        <input
          ref={email}
          className="py-7 px-4  my-5 mx-[73px] w-[300px] h-[50px] rounded-md border-[1px] border-slate-700 bg-slate-700"
          type="text"
          name="email-or-phone-no"
          placeholder="Email or phone number"
        ></input>
        <input
          ref={password}
          className="py-7 px-4 mx-[73px] w-[300px] h-[50px] rounded-md border-[1px] border-slate-700 bg-slate-700 "
          type="password"
          name="password"
          placeholder="password"
        ></input>
        <p className="relative start-[64px] text-red-600 font-medium text-lg p-2 mt-4">
          {errorMessage}
        </p>
        <p className="relative start-[20px] text-red-600 font-medium text-lg p-2">
          {errorMessage ? "" : isSignInForm ? signInError : ""}
        </p>

        <button
          className="my-3 mx-[73px] w-[300px] h-[50px] rounded-md bg-red-700 border-[1px] border-black"
          onClick={clickHandler}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <input
          className="relative inset-x-20 inset-y-12 p-2 w-5 h-5 "
          type="checkbox"
          name="Remember-me"
          id="Remember-me"
          value="Remember-me"
          onClick={rememberMeHandler}
          checked={rememberMe}
        ></input>
        <label
          htmlFor="Remember me"
          className="relative inset-x-20
         inset-y-12 p-4 text-xl cursor-pointer"
          onClick={rememberMeHandler}
        >
          Remember me
        </label>
        <p
          className="relative inset-x-[80px]
         inset-y-12 p-[1px] text-lg"
        >
          {isSignInForm ? "New to Netflix ?" : "Already a user ?"}

          <button
            className="text-xl font-bold ml-[2px]"
            onClick={signUpSignInHandler}
          >
            {isSignInForm ? " Sign Up" : " Sign In"}
          </button>
        </p>
      </form>
      <img
        src="https://assets.nflxext.com/ffe/siteui/vlv3/4da5d2b1-1b22-498d-90c0-4d86701dffcc/98a1cb1e-5a1d-4b98-a46f-995272b632dd/IN-en-20240129-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
        alt="Bg-pic-netflix"
      ></img>
    </div>
  );
};

export default Login;
