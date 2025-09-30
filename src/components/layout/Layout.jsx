import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import "./layout.css";
import axios from "axios";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_API_KEY;

const Layout = () => {
  const [apod, setApod] = useState(null);
  const [marsPhoto, setMarsPhoto] = useState(null);
  const [epic, setEpic] = useState(null);
  const [gibsTileUrl, setGibsTileUrl] = useState(null);
  const [nasaImages, setNasaImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // 👈 for lightbox

  // APOD
  useEffect(() => {
    axios
      .get("https://api.nasa.gov/planetary/apod", {
        params: { api_key: API_KEY },
      })
      .then((res) => setApod(res.data))
      .catch((err) => setErrors((e) => ({ ...e, apod: err.message })));
  }, []);

  // Mars Rover
  useEffect(() => {
    axios
      .get("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
        params: { sol: 1000, api_key: API_KEY },
      })
      .then((res) => {
        const photos = res.data?.photos || [];
        if (photos.length > 0) {
          const p = photos[0];
          setMarsPhoto({
            img: p.img_src,
            rover: p.rover?.name,
            camera: p.camera?.full_name,
            date: p.earth_date,
          });
        }
      })
      .catch((err) => setErrors((e) => ({ ...e, mars: err.message })));
  }, []);

  // EPIC Earth
  useEffect(() => {
    axios
      .get("https://api.nasa.gov/EPIC/api/natural/images", {
        params: { api_key: API_KEY },
      })
      .then((res) => {
        const data = res.data || [];
        if (data.length > 0) {
          const latest = data[data.length - 1];
          const date = latest.date.split(" ")[0];
          const [y, m, d] = date.split("-");
          const url = `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m.padStart(
            2,
            "0"
          )}/${d.padStart(2, "0")}/png/${latest.image}.png`;
          setEpic({
            url,
            caption: latest.caption,
            date: latest.date,
          });
        }
      })
      .catch((err) => setErrors((e) => ({ ...e, epic: err.message })));
  }, []);

  // GIBS static tile
  useEffect(() => {
    const tile =
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief/default/GoogleMapsCompatible_Level9/0/0/0.jpg";
    setGibsTileUrl(tile);
  }, []);

  // NASA Image Library
  useEffect(() => {
    axios
      .get("https://images-api.nasa.gov/search", {
        params: { q: "Earth", media_type: "image" },
      })
      .then((res) => {
        const items = res.data?.collection?.items || [];
        const imgs = items
          .slice(0, 6)
          .map((it) => ({
            title: it.data?.[0]?.title,
            thumb: it.links?.[0]?.href,
          }))
          .filter((x) => x.thumb);
        setNasaImages(imgs);
      })
      .catch((err) =>
        setErrors((e) => ({ ...e, imageLib: err.message }))
      );
  }, []);

  // Animated Section wrapper
  const Section = ({ id, title, children }) => (
    <motion.div
      id={id}
      className="section"
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.h2
        initial={{ opacity: 0, letterSpacing: "12px", filter: "blur(6px)" }}
        whileInView={{ opacity: 1, letterSpacing: "2px", filter: "blur(0px)" }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        {title}
      </motion.h2>
      {children}
    </motion.div>
  );

  return (
    <div>
      <Header />

      {/* APOD */}
      <Section id="apod" title="APOD: Astronomy Picture of the Day">
        {apod ? (
          <>
            {apod.url && (
              <motion.img
                src={apod.url}
                alt={apod.title}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,200,255,0.7)" }}
                transition={{ duration: 1 }}
              />
            )}
            <h3>{apod.title}</h3>
            <p>{apod.explanation}</p>
            <p><strong>Date:</strong> {apod.date}</p>
          </>
        ) : errors.apod ? (
          <p>Failed to load APOD: {errors.apod}</p>
        ) : (
          <p>Loading APOD...</p>
        )}
      </Section>

      {/* Mars Rover */}
      <Section id="mars" title="Mars Rover Photos">
        {marsPhoto ? (
          <motion.img
            src={marsPhoto.img}
            alt="Mars Rover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, rotate: 0.5 }}
            transition={{ duration: 1 }}
          />
        ) : errors.mars ? (
          <p>Failed to load Mars rover: {errors.mars}</p>
        ) : (
          <p>Loading Mars rover photo...</p>
        )}
      </Section>

      {/* NASA Image and Video Library */}
      <Section id="earth" title="NASA Image and Video Library">
        {nasaImages.length > 0 ? (
          <div className="image-grid">
            {nasaImages.map((img, idx) => (
              <motion.figure
                key={`${img.title}-${idx}`}
                initial={{ opacity: 0, y: 40, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                onClick={() => setSelectedImage(img.thumb)}
                style={{ cursor: "pointer" }}
              >
                <img src={img.thumb} alt={img.title || "NASA image"} />
                <figcaption>{img.title}</figcaption>
              </motion.figure>
            ))}
          </div>
        ) : errors.imageLib ? (
          <p>Failed to load NASA images: {errors.imageLib}</p>
        ) : (
          <p>Loading images…</p>
        )}
      </Section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox">
          {/* Close Button */}
          <button className="close-btn" onClick={() => setSelectedImage(null)}>
            ✕
          </button>

          <motion.img
            src={selectedImage}
            alt="Full view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

    </div>
  );
};

export default Layout;
