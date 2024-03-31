import { myFn } from "./modules/experiments.js";

const recDurMs = 3000;
function main() {

    log("program starting.");
    myBtnHandler(); // see output in console.log
    startAndDownloadBtnHandler();
    sayDelayedMsg(1000);

}
main();

function log(msg) { document.getElementById("log").innerHTML += `${msg}<br/>` }

function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve("myVal"), ms));
}

function stop(stream) {
    stream.getTracks().forEach((trk) => trk.stop());
}

function startRecording(stream, lenMs) {
    let preview = document.getElementById("preview");
    // let rec = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" }); // Vertex AI is hallucinating badly with all videos.
    let rec = new MediaRecorder(stream, { mimeType: "video/webm; codecs=av1" }); // AV1 does not currently work with Vertex AI
    let data = [];

    rec.ondataavailable = (event) => data.push(event.data);
    rec.start();
    log(`${rec.state} for ${lenMs}ms`);

    let stopped = new Promise((resolve, reject) => {
        rec.onstop = resolve;
        rec.onerror = (event) => reject(event.name);
    });

    let recorded = wait(lenMs).then(() => {
        if (rec.state === "recording") {
            rec.stop();
            stop(preview.srcObject);
            log("recording stopped.")
        }
    });

    return Promise.all([stopped, recorded]).then(() => data);
}

function startAndDownloadBtnHandler() {
    let startButton = document.getElementById("startButton");
    let downloadBtn = document.getElementById("download");
    let preview = document.getElementById("preview");
    let recording = document.getElementById("recording");

    startButton.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: true })
            .then((stream) => previewStream(stream))
            .then(() => startRecording(preview.captureStream(), recDurMs))
            .then((recdChunks) => makeRecording(recdChunks))
            .catch((err) => {
                if (err.name === "NotFoundError") {
                    log("Camera or microphone not found. Cannot record.");
                    return;
                }
                log(err);
            });
    }, false);

    function previewStream(stream) {
        preview.srcObject = stream;
        downloadBtn.href = stream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;
        return new Promise((resolve) => (preview.onplaying = resolve));
    }

    function makeRecording(recdChunks) {
        let blob = new Blob(recdChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(blob);
        log(`Setting href=${recording.src}.`)
        downloadBtn.href = recording.src;
        downloadBtn.download = "RecordedVideo.webm";

        log(`Sucessfully recorded ${blob.size} bytes of ${blob.type}.`)
    }

}

function myBtnHandler() {
    let myBtn = document.getElementById("myBtn");
    myBtn.addEventListener("click", (ev) => myFn(ev));
}


function sayDelayedMsg(ms) {
    wait(ms).then(() => log(`${ms}ms delay over.`));
}
