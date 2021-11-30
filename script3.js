const constraints = {
	audio: false,
	video: {
		facingMode: 'user'
	}
};

const getFrameFromVideo = (output, video, canvas) => {
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(video.width, 0);
	ctx.scale(-1, 1);
	ctx.drawImage(video, 0, 0, video.width, video.height);
	// ctx.beginPath();
	// ctx.lineWidth = 5;
	// ctx.strokeStyle = 'white';
	// ctx.rect(90, 0, 540, 540);
	// ctx.stroke();
	ctx.restore();
	sketch(output, 1080, 1080, canvas);
	requestAnimationFrame(() => getFrameFromVideo(output, video, canvas));
};

const getCameraStream = video => {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function success(stream) {
			video.srcObject = stream;
		});
};

const createVideo = (id, width, height) => {
	const video = document.createElement('video');
	video.id = id;
	video.width = width;
	video.height = height;
	video.autoplay = true;
	video.controls = true;
	return video;
};

const createCanvas = (id, width, height) => {
	const canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

const init = () => {
	const video = createVideo('vid', 720, 540);
	const canvas = createCanvas('canvas', 720, 540);
	const output = createCanvas('output', 1080, 1080);
	const app = document.getElementById('app');
	getCameraStream(video);
	getFrameFromVideo(output, video, canvas);
	// app.appendChild(video);
	app.appendChild(canvas);
	app.appendChild(output);
	console.log('init');
};

const sketch = (output, width, height, video) => {
	const context = output.getContext('2d');
	context.clearRect(0, 0, 1080, 1080);

	const cell = 18;
	const cols = Math.floor(width / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;
	const videoContext = video.getContext('2d');

	const videoData = videoContext.getImageData(90, 0, 540, 540).data;
	console.log(videoData);

	const fontFamily = 'serif';

	for (let i = 0; i < numCells; i++) {
		const col = i % cols;
		const row = Math.floor(i / cols);

		const x = col * cell;
		const y = row * cell;

		const r = Math.floor(
			videoData[
				(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) * 4 +
					0
			] *
				0.299 +
				videoData[
					(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) *
						4 +
						1
				] *
					0.587 +
				videoData[
					(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) *
						4 +
						2
				] *
					0.114
		);
		const glyph = getGlyph(r);
		context.save();
		context.translate(x, y);
		context.translate(cell * 0.5, cell * 0.5);

		context.beginPath();
		context.fillStyle = 'white';
		// if (Math.random() < 0.36) {
		// 	context.fillStyle = 'red';
		// }
		// if (Math.random() < 0.33) {
		// 	context.fillStyle = 'green';
		// }

		context.font = `${(cell * r * 1.5) / 256}px ${fontFamily}`;
		// if (Math.random() > 0.9) {
		// 	context.font = `${(cell * 4 * r) / 256}px ${fontFamily}`;
		// }
		context.fillText(glyph, 0, 0);

		context.restore();
	}
};

const componentToHex = c => {
	let hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const getGlyph = v => {
	if (v <= 30) return '';
	if (Math.random() < 0.9) {
		return '.,-~:;=!*/#$'[Math.floor(((v - 31) * 12) / 225)];
	}
	if (Math.random() < 0.08) {
		return 'Hi';
	}
	return '_-+/'[Math.floor(Math.random() * 4)];
};

document.getElementById('app').onload = init();
