
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const gallery = document.getElementById('gallery');
    const timerDisplay = document.getElementById('timer');

    let mediaStream = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let timerInterval = null;
    let seconds = 0;

    function startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mediaStream = stream;
          video.srcObject = stream;
        })
        .catch(error => {
          alert("Camera access denied or not supported!");
          console.error(error);
        });
    }

    function takePhoto() {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      const imgElement = document.createElement('img');
      imgElement.src = imageData;

      const downloadBtn = document.createElement('a');
      downloadBtn.href = imageData;
      downloadBtn.download = 'photo.png';
      downloadBtn.textContent = '⬇️ Download';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️ Delete';
      deleteBtn.onclick = () => item.remove();

      const actions = document.createElement('div');
      actions.className = 'media-actions';
      actions.appendChild(downloadBtn);
      actions.appendChild(deleteBtn);

      const item = document.createElement('div');
      item.className = 'media-item';
      item.appendChild(imgElement);
      item.appendChild(actions);

      gallery.appendChild(item);
    }

    function startRecording() {
      if (!mediaStream) {
        alert("Start the camera first.");
        return;
      }

      recordedChunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);

        const recordedVideo = document.createElement('video');
        recordedVideo.src = videoURL;
        recordedVideo.controls = true;

        const downloadBtn = document.createElement('a');
        downloadBtn.href = videoURL;
        downloadBtn.download = 'video.webm';
        downloadBtn.textContent = '⬇️ Download';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.onclick = () => item.remove();

        const actions = document.createElement('div');
        actions.className = 'media-actions';
        actions.appendChild(downloadBtn);
        actions.appendChild(deleteBtn);

        const item = document.createElement('div');
        item.className = 'media-item';
        item.appendChild(recordedVideo);
        item.appendChild(actions);

        gallery.appendChild(item);
      };

      mediaRecorder.start();
      startTimer();
    }

    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        stopTimer();
      }
    }

    function startTimer() {
      seconds = 0;
      timerDisplay.textContent = `⏱ Timer: 0s`;
      timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `⏱ Timer: ${seconds}s`;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
      timerDisplay.textContent = `⏱ Timer: 0s`;
    }
  