import axios from "axios";
import React, { useState } from "react";
import Spinner from "./Spinner";

const ImageGenerator = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [payload, setPayload] = useState({
    prompt: "",
    aspectRatio: "1:1",
    seed: 5,
    style_preset: "anime",
    output_format: "png",
  });

  // input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Image generation payload:", payload);

    // validate input
    setImageSrc(null);
    setLoading(true);
    setError(false);

    // api key and url
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    try {
      const response = await axios.post(apiUrl, payload, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log("Image generated successfully");
        const blob = new Blob([response.data], { type: "image/webp " });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        console.log("Image generated successfully:", imageUrl);
      } else {
        console.error(
          `Error generating image: ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-5 mt-12">
      <div className="grid gap-8 p-10 border-2 border-purple-400 rounded-lg bg-purple-200 lg:grid-cols-2">
        {/* option */}
        <form action="" onSubmit={handleSubmit}>
          {/* prompt */}
          <label htmlFor="prompt">Prompt</label>
          <textarea
            name="prompt"
            onChange={handleChange}
            value={payload.prompt}
            id="prompt"
            rows="4"
            className="w-full p-2 mt-2 border border-purple-500 rounded-lg"
            placeholder="Enter your prompt here..."
          ></textarea>
          {/* image style */}
          <label htmlFor="style" className="mt-4">
            Image Style
          </label>
          <select
            name="style_preset"
            onChange={handleChange}
            value={payload.style_preset}
            id="style"
            className="w-full p-2 mt-2 border border-purple-500 rounded-lg"
          >
            <option value="anime">Anime</option>
            <option value="cinematic">Cinematic</option>
            <option value="photographic">Photographic</option>
            <option value="neon-punk">Neon-Punk</option>
            <option value="3d-model">3d-Model</option>
            <option value="isometric">Isometric</option>
            <option value="digital-art">Digital-Art</option>
            <option value="pixel-art">Pixel-Art</option>
            <option value="low-poly">Low-Poly</option>
            <option value="line-art">Line-Art</option>
            <option value="comic-book">Comic-Book</option>
            <option value="enhance">Enhance</option>
            <option value="fantasy-art">Fantasy-art</option>
            <option value="origami">Origami</option>
            <option value="tile-texture">Tile-texture</option>
          </select>
          {/* image format */}
          <label htmlFor="format" className="mt-4">
            Image Format
          </label>
          <select
            name="output_format"
            onChange={handleChange}
            value={payload.output_format}
            id="format"
            className="w-full p-2 mt-2 border border-purple-500 rounded-lg"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>

          {/* button */}
          <button
            type="submit"
            className="w-full mt-4 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
          >
            Generate Image
          </button>
        </form>
        {/* image */}
        <div>
          <div className="w-full h-96 bg-gray-200 flex flex-col items-center justify-center rounded-lg relative">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p className="text-red-500">Error generating image</p>
            ) : imageSrc ? (
              <>
                <img
                  src={imageSrc}
                  alt="Generated"
                  className="w-full h-full object-cover rounded-lg"
                />
                <a
                  href={imageSrc}
                  download={`image-ai.${payload.output_format}`}
                  className="absolute bottom-4 border-1 text-white p-2 rounded-lg hover:bg-purple-500"
                >
                  Download
                </a>
              </>
            ) : (
              <p className="text-gray-500">No image generated yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
