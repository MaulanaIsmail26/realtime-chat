/* eslint-disable @next/next/no-img-element */
import React from "react";
import Head from "next/head";
import style from "@/styles/pages/loginStyle.module.scss";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/pages/utils/firebase";
import * as useDb from "@/pages/utils/database";
import { useRouter } from "next/router";
const provider = new GoogleAuthProvider();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usersList, setUsersList] = React.useState([]);

  React.useEffect(() => {
    useDb.getData("users", (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUsersList(data);
      }
    });
  }, []);

  // LOGIN MANUAL
  const loginManual = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);

        useDb.sendData("users", {
          ...usersList,
          [user.uid]: {
            ...usersList[user.uid],
            ...{
              isOnline: true,
            },
          },
        });

        localStorage.setItem("user", JSON.stringify(user));
        router.replace("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // LOGIN WITH GOOGLE
  const loginGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        // console.log(result);

        useDb.sendData("users", {
          ...usersList,
          [user.uid]: {
            ...usersList[user.uid],
            ...{
              isOnline: true,
            },
          },
        });

        localStorage.setItem("user", JSON.stringify(user));
        router.replace("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <>
      <Head>
        <title>Login | Telegram app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main}>
        <div
          className={`container-fluid p-0 d-flex justify-content-center align-items-center ${style.container}`}
        >
          <div className={` px-5 shadow ${style.cardLogin}`}>
            {/* TITLE */}
            <div className={`d-flex justify-content-center ${style.title}`}>
              <h4>Login</h4>
            </div>
            {/* SUB TITLE */}
            <div className={`d-block mt-3 ${style.subTitle}`}>
              <p>Hi, Welcome back!</p>
            </div>
            {/* FORM LOGIN */}
            <div className={`mb-3 ${style.formLogin}`}>
              <form>
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="phone"
                    aria-describedby="emailHelp"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Link href={""} className={`${style.forgotPass}`}>
                  <p className={`text-end`}>Forgot password?</p>
                </Link>
              </form>
            </div>
            {/* BUTTON LOGIN */}
            <div className={`mb-3 ${style.btnLogin}`}>
              <button
                type="button"
                className="btn btn-primary rounded-pill"
                onClick={loginManual}
              >
                Login
              </button>
            </div>
            {/* LOGIN WITH GOOGLE */}
            <div className={`text-center mb-3 ${style.regWithGoogle}`}>
              <p>Login with</p>
            </div>
            {/* BUTTON GOOGLE */}
            <div className={`mb-4 ${style.btnGoogle}`}>
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center"
                onClick={loginGoogle}
              >
                <img
                  className={`me-2 ${style.iconGoogle}`}
                  src="/images/icon-google.webp"
                  alt="icon-navbar"
                />
                Google
              </button>
            </div>
            {/* REGISTER NOW */}
            <div className={`register ${style.register}`}>
              <p className="text-center">
                Don’t have an account?{" "}
                <Link
                  href={"/auth/register"}
                  className={`${style.linkRegister}`}
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
