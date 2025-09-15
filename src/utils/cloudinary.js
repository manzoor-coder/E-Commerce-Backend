import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


const uploadOnCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        })

        // file has been uploaded successfully
        console.log("File is uploaded successfully", response.url);
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        fs.unlinkSync(localfilepath);
        return null;
      }
}


export {uploadOnCloudinary}