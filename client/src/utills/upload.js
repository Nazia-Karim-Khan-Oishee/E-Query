// utils/upload.js
const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "xxfpi3ob");
  data.append("cloud_name", "dv2hhm8iv");

  try {
    const response = await fetch(
      //   "cloudinary://388831884279878:6h7_-qSv1hEGvsJSiuHj6qyj0mk@dv2hhm8iv",
      //   "https://upload-request.cloudinary.com/dv2hhm8iv/2878e0c540863ecd8d68f586022b3ecd",

      "https://api.cloudinary.com/v1_1/dv2hhm8iv/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const resData = await response.json();
    return resData.url;
  } catch (err) {
    console.error(err);
  }
};

export default upload;
