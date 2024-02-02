import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';  // Add this import
import { updateProfile } from 'firebase/auth';  // Add this import
import { auth, storage } from '../firebase';
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        // Upload the new photo to Firebase Storage
        const storageRef = ref(storage, `${currentUser.uid}_profile_pic`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Error uploading photo:', error);
          },
          () => {
            // Image uploaded successfully, get the download URL
            getDownloadURL(storageRef).then(async (downloadURL) => {
              // Update the user's profile with the new photo URL
              await updateProfile(auth.currentUser, { photoURL: downloadURL });

              // Force a re-render to reflect the updated photo
              window.location.reload();
            });
          }
        );
      } catch (error) {
        console.error('Error updating profile photo:', error);
      }
    }
  };

  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        <label htmlFor="photoInput">
          <img src={currentUser.photoURL} alt="" />
        </label>
        <input
          type="file"
          id="photoInput"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
