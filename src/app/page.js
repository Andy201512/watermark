"use client"
import styles from './page.module.css'
import { useState } from 'react';
import { useRef } from 'react';

export default function Watermark() {

  const originInputRef = useRef(null);
  const watermarkInputRef = useRef(null);
  const canvasRef = useRef(null);

  function handleOriginInputChange(e) {
    let ctx = canvasRef.current.getContext("2d");
    let img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  };

  function handleWatermarkInputChange(e) {
    let ctx = canvasRef.current.getContext("2d");
    let img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  };

  function handleGenerateButtonClick() {
    let canvas = canvasRef.current;

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
          ref={originInputRef}
          type='file'
          accept='image/*'
          onChange={handleOriginInputChange}
        ></input>
      </div>
      <div className={styles.watermark}>
        <p>watermark picture</p>
        <input
          ref={watermarkInputRef}
          type='file'
          accept='image/*'
          onChange={handleWatermarkInputChange}
        ></input>
      </div>
      <div className={styles.preview}>
        <p>preview</p>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className={styles.output}>
        <p>output picture</p>
        <button onClick={handleGenerateButtonClick}>generate</button>
      </div>
    </main>
  );
}
