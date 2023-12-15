"use client"
import styles from './page.module.css'
import { useState } from 'react';
import { useRef } from 'react';

export default function Watermark() {

  const previewBackgroundRef = useRef(null);
  const previewWatermarkRef = useRef(null);
  const dropDistance = {x: 0,y: 0};

  // 一个获取元素定位样式数值的方法
  function getCPS (ref, name){ return parseFloat(window.getComputedStyle(ref, null)[name]) }; 
  
  // 一个获取元素长宽样式数值的方法
  function getCLS(ref, name){ return parseFloat(window.getComputedStyle(ref, null)[name === "top" ? 'height' : 'width']) }; 

  function getNewDistance(ref, bgRef, name, moveValue){

    // 为了限制水印不超出原图范围，区分情形赋值，合法赋值区间应是背景线减去水印线的宽线上
    // bgstart   ----------------------------------   bgend  背景区间
    // wtstart                               ======   wtend  水印区间
    // lgstart   ****************************         lgend  合法区间

    // 另外由于居中定位给原图和水印图都加了百分比定位和百分比平移，计算时要补上对齐
    
    const computedValue = getCPS(ref, name) + moveValue;
    const bgStart = getCPS(bgRef, name) - 0.5 * getCLS(bgRef, name) + 0.5 * getCLS(ref, name);
    const bgEnd = bgStart + getCLS(bgRef, name) - getCLS(ref, name);
    
    if(computedValue < bgStart) return bgStart;
    if(computedValue > bgEnd) return bgEnd;
    return computedValue;
  };


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
    img.addEventListener("dragstart", handleWatermarkDragstart);
    img.addEventListener("dragend", handleWatermarkDragend);
  };

  function handleWatermarkDragstart(e) {
    dropDistance.x = e.screenX;
    dropDistance.y = e.screenY;
  };

  function handleWatermarkDragend(e) {
    dropDistance.x = e.screenX - dropDistance.x;
    dropDistance.y = e.screenY - dropDistance.y;

    const ref = previewWatermarkRef.current
    const bgRef = previewBackgroundRef.current;
    ref.style.top = getNewDistance(ref, bgRef, 'top', dropDistance.y) + 'px';
    ref.style.left = getNewDistance(ref, bgRef, 'left', dropDistance.x) + 'px';
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
