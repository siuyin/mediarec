const recordButton = document.getElementById('record-btn');
let mediaRecorder;
let audioChunks = [];
let audStream = null;

recordButton.addEventListener('mousedown', startRecording);
recordButton.addEventListener('mouseup', stopRecordingAndDownload);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream,{mimeType:"audio/webm;codecs=opus",audioBitsPerSecond:16000});
            // mediaRecorder = new MediaRecorder(stream,{mimeType:"audio/webm;codecs=opus"});
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.start();
            audStream = stream;
        })
        .catch(err => console.error(err));
}

function stopRecordingAndDownload() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: 'audio/webm' });
            const url = window.URL.createObjectURL(blob);
            const filename = myDateFmt(new Date()) + ".webm";
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            audioChunks = [];
            stop(audStream);
        };
    }
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

function stop(stream) {
    stream.getTracks().forEach((trk) => trk.stop());
}