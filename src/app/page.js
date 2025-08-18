"use client"
import styles from './page.module.css'
import { useRef } from 'react';

export default function Watermark() {

  const watermarkInputRef = useRef(null)
  const previewBackgroundRef = useRef(null);
  const previewWatermarkRef = useRef(null);
  const previewTextRef = useRef(null);
  const mouseStartPoint = { x: 0, y: 0 };
  const mouseEndPoint = { x: 0, y: 0 };

  // 获取新的水印定位
  function getNewDistance(wmRef, bgRef, name, moveValue) {

    // 为了限制水印不超出原图范围，区分情形赋值，合法赋值区间应是背景线减去水印线的宽线上
    // bgstart   ----------------------------------   bgend  背景区间
    // wmstart                               ======   wmend  水印区间
    // lgstart   ****************************         lgend  合法区间

    const upperName = name.slice(0,1).toUpperCase()+ name.slice(1)

    const computedValue = wmRef['offset' + upperName] + moveValue;
    const bgl = bgRef['offset' + (name === "top" ? 'Height' : 'Width')];
    const wml = wmRef['offset' + (name === "top" ? 'Height' : 'Width')];

    const bgStart = bgRef['offset' + upperName];
    const bgEnd = bgStart + bgl - wml;

    if (computedValue < bgStart) return bgStart;
    if (computedValue > bgEnd) return bgEnd;
    return computedValue;
  };

  function handleOriginInputChange(e) {
     
    if(document.getElementById('bgImg')){document.getElementById('bgImg').remove()};
    if(document.getElementById('wmImg')){
      document.getElementById('wmImg').remove(); 
      watermarkInputRef.current.value = null;
    };
    if(!e.target.files[0])return;
    
    const img = document.createElement('img');
    img.id = 'bgImg';
    img.style.height = '100%';
    img.style.width = 'auto';
    img.style.objectFit = 'contain';
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      previewBackgroundRef.current.append(img)
      // 隐藏预览绿幕文字
      previewTextRef.current.style.visibility = 'hidden';
    };
  };

  function handleWatermarkInputChange(e) {
    
    if(document.getElementById('wmImg')){document.getElementById('wmImg').remove()};
    if(!document.getElementById('bgImg')){ alert('please select a origin picture!'); return};
    if(!e.target.files[0])return;

    const bgRef = document.getElementById('bgImg');
    const bgScaleFactor = bgRef.offsetHeight / bgRef.naturalHeight;

    const img = document.createElement('img');
    img.id = 'wmImg';
    img.draggable = true;
    img.classList.add('draggable');
    document.styleSheets[0].insertRule(".draggable { cursor: move; cursor: -webkit-move; }");
    document.styleSheets[0].insertRule(".draggable:active { cursor: move; cursor: -webkit-move;}");
    img.style.position = 'absolute';
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      previewWatermarkRef.current.append(img);
      img.style.height = img.naturalHeight * bgScaleFactor + 'px';
      img.style.width = 'auto';
    };
    img.addEventListener("dragstart", handleWatermarkDragstart);
    img.addEventListener("dragend", handleWatermarkDragend);
        // 添加放入相关事件，以改变鼠标显示为禁止符号的问题
    previewWatermarkRef.current.addEventListener("drag", (event) => {event.preventDefault()});
    previewWatermarkRef.current.addEventListener("dragenter", (event) => {event.preventDefault();});
    previewWatermarkRef.current.addEventListener("dragover", (event) => {event.preventDefault()});
  };

  function handleWatermarkDragstart(e) {
    mouseStartPoint.x = e.screenX;
    mouseStartPoint.y = e.screenY;
  };

  function handleWatermarkDragend(e) {
    mouseEndPoint.x = e.screenX;
    mouseEndPoint.y = e.screenY;

    const bgRef = document.getElementById('bgImg');
    const wmRef = document.getElementById('wmImg');

    wmRef.style.top = getNewDistance(wmRef, bgRef, 'top', mouseEndPoint.y - mouseStartPoint.y) + 'px';
    wmRef.style.left = getNewDistance(wmRef, bgRef, 'left', mouseEndPoint.x - mouseStartPoint.x) + 'px';
  };

  function handleGenerateButtonClick() {

    if(!document.getElementById('bgImg')){ alert('please select a origin picture!'); return};
    if(!document.getElementById('wmImg')){ alert('please select a watermark picture!'); return};

    const bgRef = document.getElementById('bgImg');
    const wmRef = document.getElementById('wmImg');

    const canvas = document.createElement('canvas');
    canvas.height = bgRef.naturalHeight;
    canvas.width = bgRef.naturalWidth;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(document.getElementById('bgImg'), 0, 0);

    const bgScaleFactor = bgRef.naturalHeight / bgRef.offsetHeight;
    let offsetX = wmRef.offsetLeft - bgRef.offsetLeft;
    let offsetY = wmRef.offsetTop - bgRef.offsetTop;

    ctx.drawImage(document.getElementById('wmImg'), offsetX * bgScaleFactor, offsetY * bgScaleFactor);

    const el = document.createElement('a');
    el.href = canvas.toDataURL("image/jpeg", 0.6);
    el.download = '合成图片' + new Date().getTime();

    const event = new MouseEvent('click');
    el.dispatchEvent(event);
  };

  return (
    <main className={styles.main}>
      <div className={styles.origin}>
        <button className={styles.generateButton} onClick={(e)=>{e.target.nextElementSibling.click()}}>上传背景图</button>
        <input
          type='file'
          accept='image/*'
          onChange={handleOriginInputChange}
        ></input>
      </div>
      <div className={styles.watermark}>
        <button className={styles.generateButton} onClick={(e)=>{e.target.nextElementSibling.click()}}>上传水印图</button>
        <input
          type='file'
          accept='image/*'
          onChange={handleWatermarkInputChange}
          ref={watermarkInputRef}
        ></input>
      </div>
      <div className={styles.output}>
        <button className={styles.generateButton} onClick={handleGenerateButtonClick}>生成水印图</button>
      </div>
      <div className={styles.preview}>
        <div ref={previewTextRef} className={styles.previewText}>预览绿幕</div>
        <div className={styles.previewBox}>
          <div ref={previewBackgroundRef} className={styles.previewBackground}></div>
          <div ref={previewWatermarkRef} className={styles.previewWatermark}></div>
        </div>
      </div>
      <div className={styles.parameter}>
        
      </div>
    </main>
  );
}
