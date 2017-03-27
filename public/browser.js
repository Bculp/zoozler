const recordBtn = document.querySelector('#record');
const stopBtn = document.querySelector('#stop');
const files = document.querySelector('.files');
let options, stream, recordedChunks = [];

// Check to see what media type is supported
if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
  options = {mimeType: 'video/webm; codecs=vp9'};
} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
   options = {mimeType: 'video/webm; codecs=vp8'};
} else {
  console.log('Other mimeType supported');
}

// Stream can be from getUserMedia, receiving end of WebRTC, screen recording etc.
function startRecording() {
	navigator.mediaDevices.getUserMedia({ video: true, audio: true })
	.then(localMediaStream => {
		// Create media recorder with local stream and options object
		mediaRecorder = new MediaRecorder(localMediaStream, options);
		// If there's data, handle it by pushing to chunk array
		mediaRecorder.ondataavailable = handleDataAvailable;
		// Start the recording
		mediaRecorder.start();
	})
	.catch(err => {
		console.error('Problem retrieving stream', err);
	});
}

function handleDataAvailable(event) {
	if (event.data.size > 0) {
		recordedChunks.push(event.data);
		download()
	} else {
		console.log('no data to push');
	}
}

function download() {
	let blob = new Blob(recordedChunks, {
		type: options.mimeType
	});

	// Download video immediately with somewhat hacky link click
	// Can't change file download path for security reasons
	let url = URL.createObjectURL(blob);
	let a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	a.href = url;
	a.download = 'test.webm';
	a.click();
	window.URL.revokeObjectURL(url);
}

recordBtn.addEventListener('click', () => startRecording());
stopBtn.addEventListener('click', () => mediaRecorder.stop());

fetch('/videos')
.then(res => console.log(res.body))
.then(files => {
	console.log('files are:', files)
	files.forEach(file => {
		let li = document.createElement('li');
		li.textContent = file;
		files.appendChild(li);
	})
})
.catch(error => console.log(error));
