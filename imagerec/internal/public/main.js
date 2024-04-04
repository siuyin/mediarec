const video = document.getElementById('video');
const captureButton = document.getElementById('capture-button');
const downloadLink = document.getElementById('download-link');

captureButton.addEventListener('click', captureImage);

async function captureImage() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 } });
        video.srcObject = stream;

        const canvas = document.createElement('canvas');
        //const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');

        canvas.width = video.width;
        canvas.height = video.height;

        setTimeout(() => {
            ctx.drawImage(video, 0, 0)
            canvas.toBlob((blob) => {
                let url = URL.createObjectURL(blob);
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = myDateFmt(new Date()) + ".jpg";
                downloadLink.click();
                URL.revokeObjectURL(url);
            }, "image/jpeg");
        }, 40); // one PAL frame?
    } catch (error) {
        console.error('Error capturing image:', error);
    }
}

function stop(stream) {
    stream.getTracks().forEach((trk) => trk.stop());
}


function myDateFmt(date) {
    return date.getFullYear()
        + String(date.getMonth() + 1).padStart(2, "0")
        + String(date.getDate()).padStart(2, "0")
        + "-"
        + String(date.getHours()).padStart(2, "0")
        + String(date.getMinutes()).padStart(2, "0")
        + String(date.getSeconds()).padStart(2, "0");
}
