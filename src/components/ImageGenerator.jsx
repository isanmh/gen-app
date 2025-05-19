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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Image generation payload:", payload);

    setImageSrc(null);
    setLoading(true);
    setError(false);

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
        const blob = new Blob([response.data], { type: "image/webp" });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
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
    <div className="container mt-5">
      <div className="row g-4 p-4 border border-primary rounded bg-light">
        {/* Form Section */}
        <form className="col-lg-6" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="prompt" className="form-label">
              Prompt
            </label>
            <textarea
              name="prompt"
              onChange={handleChange}
              value={payload.prompt}
              id="prompt"
              rows="4"
              className="form-control"
              placeholder="Enter your prompt here..."
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="style" className="form-label">
              Image Style
            </label>
            <select
              name="style_preset"
              onChange={handleChange}
              value={payload.style_preset}
              id="style"
              className="form-select"
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
          </div>

          <div className="mb-3">
            <label htmlFor="format" className="form-label">
              Image Format
            </label>
            <select
              name="output_format"
              onChange={handleChange}
              value={payload.output_format}
              id="format"
              className="form-select"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Generate Image
          </button>
        </form>

        {/* Image Section */}
        <div className="col-lg-6">
          <div
            className="d-flex flex-column align-items-center justify-content-center border rounded bg-secondary text-white position-relative overflow-hidden"
            style={{ height: "24rem" }}
          >
            {loading ? (
              <Spinner />
            ) : error ? (
              <p className="text-danger">Error generating image</p>
            ) : imageSrc ? (
              <>
                <div
                  className="w-100 h-100"
                  style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <a
                  href={imageSrc}
                  download={`image-ai.${payload.output_format}`}
                  className="btn btn-outline border text-white position-absolute bottom-0 mb-3 custom-hover"
                >
                  Download
                </a>
              </>
            ) : (
              <p>No image generated yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
