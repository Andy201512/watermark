"use client"
import styles from './page.module.css'
import { useState } from 'react';
import { useRef } from 'react';

export default function Watermark() {

  const previewBackgroundRef = useRef(null);
  const previewWatermarkRef = useRef(null);
  const dropDistance = { x: 0, y: 0 };

  // 获取元素样式数值的方法
  function getCSNum(ref, name) { return parseFloat(window.getComputedStyle(ref, null)[name]) };

  // 获取新的水印定位
  function getNewDistance(wmRef, bgRef, name, moveValue) {

    // 为了限制水印不超出原图范围，区分情形赋值，合法赋值区间应是背景线减去水印线的宽线上
    // bgstart   ----------------------------------   bgend  背景区间
    // wmstart                               ======   wmend  水印区间
    // lgstart   ****************************         lgend  合法区间

    // 另外由于居中定位给原图和水印图都加了百分比定位和百分比平移，计算时要补上对齐

    const computedValue = getCSNum(wmRef, name) + moveValue;
    const bgl = getCSNum(bgRef, name === "top" ? 'height' : 'width');
    const wml = getCSNum(wmRef, name === "top" ? 'height' : 'width');

    const bgStart = getCSNum(bgRef, name) - 0.5 * (bgl - wml);
    const bgEnd = bgStart + bgl - wml;

    if (computedValue < bgStart) return bgStart;
    if (computedValue > bgEnd) return bgEnd;
    return computedValue;
  };


  function handleOriginInputChange(e) {
     
    if(!e.target.files[0]){
      if(document.getElementById('bgImg')){document.getElementById('bgImg').remove()};
      return;
    };
    
    const img = document.createElement('img');
    img.id = 'bgImg';
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      previewBackgroundRef.current.append(img)
    };
  };

  function handleWatermarkInputChange(e) {
    
    if(!e.target.files[0]){
      if(document.getElementById('wmImg')){document.getElementById('wmImg').remove()};
      return;
    };

    const img = document.createElement('img');
    img.id = 'wmImg';
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

    const bgRef = previewBackgroundRef.current;
    const wmRef = previewWatermarkRef.current;


    wmRef.style.top = getNewDistance(wmRef, bgRef, 'top', dropDistance.y) + 'px';
    wmRef.style.left = getNewDistance(wmRef, bgRef, 'left', dropDistance.x) + 'px';
  };

  function handleGenerateButtonClick() {

    if(!document.getElementById('bgImg')){ alert('please select a origin picture!'); return};
    if(!document.getElementById('wmImg')){ alert('please select a watermark picture!'); return};

    const bgRef = previewBackgroundRef.current;
    const wmRef = previewWatermarkRef.current;

    const canvas = document.createElement('canvas',
      {
        height: getCSNum(bgRef, 'height') + 'px',
        width: getCSNum(bgRef, 'width') + 'px'
      });
    const ctx = canvas.getContext("2d");

    ctx.drawImage(document.getElementById('bgImg'), 0, 0);

    // TODO: 可以梳理一下看有没有更简便的偏移坐标算法
    let offsetX = getCSNum(wmRef, 'left') - (getCSNum(bgRef, 'left') - 0.5 * (getCSNum(bgRef, 'width') - getCSNum(wmRef, 'width')));
    let offsetY = getCSNum(wmRef, 'top') - (getCSNum(bgRef, 'top') - 0.5 * (getCSNum(bgRef, 'height') - getCSNum(wmRef, 'height')));

    ctx.drawImage(document.getElementById('wmImg'), offsetX, offsetY);

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
