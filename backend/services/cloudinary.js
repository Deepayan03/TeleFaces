import cloudinary, { v2 as cdnary } from "cloudinary";
class Cloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.cloudinary_cloudName,
      api_key: process.env.cloudinary_apiKey,
      api_secret: process.env.cloudinary_secret,
    });
  }
   async uploadFile(path) {
    const result = await cdnary.uploader.upload(path, {
      folder: "Telefaces",
      width: 250,
      height: 250,
      gravity: "faces",
      crop: "fill",
    });
    return result;
  }
  async deleteFile(publicId){
    const result = await cdnary.uploader.destroy(user.avatar.public_id);
    return result;
  }
}

export default new Cloudinary;