"use client"
import styles from './page.module.css'
import { useState } from 'react';
import { useRef } from 'react';

export default function Watermark() {

  const previewBackgroundRef = useRef(null);
  const previewWatermarkRef = useRef(null);

  function handleOriginInputChange(e) {
    let img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      previewBackgroundRef.current.append(img)
    };
  };

  function handleWatermarkInputChange(e) {
    let img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      previewWatermarkRef.current.append(img)
    };
  };

  function handleGenerateButtonClick() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    // ctx.drawImage(img, 0, 0);

    const el = document.createElement('a');
    el.href = canvas.toDataURL();
    el.download = '合成图片';

    const event = new MouseEvent('click');
    el.dispatchEvent(event);
  };

  return (
    <main className={styles.main}>
      <div className={styles.origin}>
        <p>origin picture</p>
        <input
          type='file'
          accept='image/*'
          onChange={handleOriginInputChange}
        ></input>
      </div>
      <div className={styles.watermark}>
        <p>watermark picture</p>
        <input
          type='file'
          accept='image/*'
          onChange={handleWatermarkInputChange}
        ></input>
      </div>
      <div className={styles.preview}>
        <p>preview</p>
        <div className={styles.previewBox}>
          <div ref={previewBackgroundRef} className={styles.previewBackground}></div>
          <div ref={previewWatermarkRef} className={styles.previewWatermark}></div>
        </div>
      </div>
      <div className={styles.output}>
        <p>output picture</p>
        <button onClick={handleGenerateButtonClick}>generate</button>
      </div>
    </main>
  );
}
