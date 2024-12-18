window.createBitmap = async function (dotnetref, _w, _h) {
    const file = document.getElementById("input-image").files[0];
    if (!file) {
        console.log("there is no file here");
        return;
    }
    const imagebitmap = await createImageBitmap(file, { resizeHeight: _h, resizeWidth: _w });
    const w = imagebitmap.width;
    const h = imagebitmap.height;
    const offsc = new OffscreenCanvas(w, h);
    const ctx = offsc.getContext('2d');
    ctx.drawImage(imagebitmap, 0, 0);
    const arr = new Uint8Array(w * h);
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < arr.length; ++i) {
        arr[i] = 0.299 * data[i * 4 + 0] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    }
    await dotnetref.invokeMethodAsync("DataRecieve", arr, w, h);
    imagebitmap.close();
}

window.changeFontSize = (size) => {
    const ele = document.getElementById("result");
    ele.style.fontSize = `${size}px`;
};

window.convertToImage = async () => {
    const imageplace = document.getElementById("imageplace");
    const oldcanva = imageplace.querySelector('canvas');
    const p = document.getElementById('result');
    const serializer = new XMLSerializer();
    const w = Math.max(p.clientWidth + 100, 550);
    const svg =
    `
    <svg xmlns="http://www.w3.org/2000/svg" width="(${w}px" height="${p.clientHeight + 100}px">
        <rect width="100%" height="100%" fill="#FFEBCD"/>
        <foreignObject width="${p.clientWidth}px" height="${p.clientHeight}px" x="50px" y="50px" stroke-width="1px" stroke="black">
            ${serializer.serializeToString(p)}
        </foreignObject>
        <text x="${w - 50}px" y="${p.clientHeight + 90}px" font-family="monospace" font-size="15px" text-anchor="end">
            create by dot_word_generator_page | made by PenguinL90
        </text>
    </svg>
    `;
    const imgblob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const image = document.createElement("img"); 
    image.src = URL.createObjectURL(imgblob);
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = p.clientHeight + 100;
    canvas.getContext("2d").drawImage(image, 0, 0);
    if (oldcanva !== null) {
        imageplace.removeChild(oldcanva);
    }
    canvas.classList.add("acell");
    imageplace.appendChild(canvas);
} 