// external imports
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";

// internal imports
import { config } from "../../config";
import log from "../../utils/logger";

//Initialize a firebase application
initializeApp(config.FIREBASE_CONFIG);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// ------------------------------ uploadImage ------------------------------
async function uploadImage(req, res, next) {
  // check if image is present in request
  if (!req.file) {
    log.error("No image found in request");
    req.body.image = "";
    next();
    return;
  }

  // as image is present in request, upload it to firebase storage
  upload.single("image")(req, res, async (err) => {
    if (err) {
      log.error(err);
      throw new Error("Error getting image");
    }

    const file = req.file;
    //const userID = req.user_identity.id;

    // create a reference to the storage bucket location
    const storageRef = ref(
      storage,
      //`profile_pictures/${userID}${file.originalname}`
      `profile_pictures/${file.originalname}`
    );

    // define metadata
    const metadata = {
      contentType: file.mimetype,
    };

    // upload the file
    const uploadTask = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    // get the download url
    const downloadURL = await getDownloadURL(uploadTask.ref);

    req.body.image = downloadURL;
    next();
  });
}

export default uploadImage;
