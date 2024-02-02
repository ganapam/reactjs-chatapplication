import React, { useState } from "react";
import Add from "../assests/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  auth,
  storage,
  db
} from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import {
  doc,
  setDoc,
  query,
  where,
  collection,
  getDocs
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayNameError, setDisplayNameError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    displayName: false,
    email: false,
    password: false,
    file: false,
  });
  const navigate = useNavigate();

  const generateUniqueDisplayName = async (baseName) => {
    let uniqueName = baseName;
    let counter = 1;

    while (true) {
      const displayNameQuery = query(
        collection(db, "users"),
        where("displayNameLower", "==", uniqueName.toLowerCase())
      );
      const displayNameSnapshot = await getDocs(displayNameQuery);

      if (displayNameSnapshot.empty) {
        return uniqueName;
      }

      uniqueName = `${baseName}${counter}`;
      counter++;
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    const errors = {
      displayName: !displayName,
      email: !email,
      password: !password,
      file: !file,
    };

    setFieldErrors(errors);

    // If any required field is missing, stop the submission
    if (Object.values(errors).some((error) => error)) {
      setLoading(false);
      return;
    }

    try {
      // Generate a unique display name
      const uniqueDisplayName = await generateUniqueDisplayName(displayName);

      if (uniqueDisplayName !== displayName) {
        setDisplayNameError(true);
        setLoading(false);
        return;
      }

      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${uniqueDisplayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // Update profile
            await updateProfile(res.user, {
              displayName: uniqueDisplayName,
              photoURL: downloadURL,
            });

            // Create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: uniqueDisplayName,
              email,
              photoURL: downloadURL,
              displayNameLower: uniqueDisplayName.toLowerCase(),
            });

            // Create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});

            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          {fieldErrors.displayName && <span>Please enter a display name</span>}
          {displayNameError && <span>Name Already Exists</span>}
          <input required type="email" placeholder="email" />
          {fieldErrors.email && <span>Please enter an email</span>}
          <input required type="password" placeholder="password" />
          {fieldErrors.password && <span>Please enter a password</span>}
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span> Please Add Profile Image</span>
          </label>
          {fieldErrors.file && <span>Please add a profile image</span>}
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image, please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/Login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;