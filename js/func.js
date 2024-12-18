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

window.convertToImage = (text) => {
    const imageplace = document.getElementById("imageplace");
    const oldimg = imageplace.querySelector('img');
    const p = document.getElementById('result');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const lines = text.split('\n');
    const fontSize = parseFloat(p.style.fontSize.split("px")[0]);
    const lineHeight = fontSize * 1.4;
    const txt = "create by DotWordGeneratorWeb|made by PenguinL90";

    canvas.width = (p.clientWidth + 100);
    canvas.height = (p.clientHeight + 100);

    ctx.fillStyle = '#FFEBCD';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = `normal 900 ${fontSize}px Arial`;
    ctx.fontKerning = 'none';
    lines.forEach((n, i) => {
        ctx.fillText(n, 50, (i + 1) * lineHeight + 50);
    });
    ctx.font = `normal 900 15px monospace`;
    ctx.textAlign = 'end';
    ctx.fillText(txt, canvas.width - 50, canvas.height - 10, canvas.width - 20);
    const url = canvas.toDataURL("image/png");
    const img = document.createElement('img');
    img.src = url;
    if (oldimg !== null) {
        imageplace.removeChild(oldimg);
    }
    img.classList.add("acell");
    imageplace.appendChild(img);
} 