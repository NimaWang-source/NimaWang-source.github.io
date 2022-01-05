/// <reference path="../TSDef/p5.global-mode.d.ts" />

'use strict';

let img, a;

const suggestion = [
	'節奏快一點點喔',
	'要畫甚麼就快點畫',
	'又不是在選老公老婆',
	'大家都在等你喔'
];

function preload() {
	img = loadImage('background.png');
}

function setup() {
	createCanvas(img.width * 3, img.height * 3);
	push();
	scale(3);
	image(img, 0, 0);
	pop();

	const pane = new Tweakpane.Pane({ title: '鍵盤操作' });
	pane.addBlade({
		view: 'text',
		label: '顏色切換',
		parse: v => String(v),
		value: 'r,g,b,w'
	});
	pane.addBlade({
		view: 'text',
		label: '筆刷大小',
		parse: v => String(v),
		value: '-,+'
	});
	pane.addBlade({
		view: 'text',
		label: '重製畫布',
		parse: v => String(v),
		value: 'backspace'
	});
	pane.addSeparator();
	const h = pane.addBlade({
		view: 'text',
		label: '小建議',
		parse: v => String(v),
		value: suggestion[0]
	});
	pane.disabled = true;
	// h.hidden = true;
	a = h;
}

let brushSize = 50;
let f = 0.5;
let spring = 0.5;
let friction = 0.45;
let v = 0.5;
let r = 0;
let vx = 0;
let vy = 0;
let splitNum = 100;
let diff = 8;
let color = 'black';
let action = false;
let counter = 0;

let x, y, oldX, oldY, oldR;

function draw() {
	action = false;
	if (keyIsPressed || mouseIsPressed) {
		action = true;
	}
	lineDraw();
	movementDetect();
	if (counter >= 100) {
		saySomething();
	} else {
		a.value = suggestion[frameCount % 4];
		a.hidden = true;
	}
}

function saySomething() {
	a.hidden = false;
}

function movementDetect() {
	if (!action) {
		counter += 1;
	} else {
		counter = 0;
	}
}

function keyPressed() {
	if (keyCode === 82) {
		color = 'red';
	}
	if (keyCode === 71) {
		color = 'green';
	}
	if (keyCode === 87) {
		color = 'white';
	}
	if (keyCode === 66) {
		color = 'black';
	}
	if (keyCode === 187) {
		brushSize += 5; //increase size
		diff += 0.7;
		console.log(brushSize);
		console.log(diff);
	}
	if (keyCode === 189) {
		brushSize -= 5; //decrease size
		diff -= 0.7;
		console.log(brushSize);
		console.log(diff);
	}
	if (keyCode === 8) {
		fill('white'); //clear
		noStroke();
		rect(0, 0, img.width * 3, img.height * 3);
		push();
		scale(3);
		image(img, 0, 0);
		pop();
	}
	stroke(color);
}

function lineDraw() {
	if (mouseIsPressed) {
		action = true;
		if (!f) {
			f = true;
			x = mouseX;
			y = mouseY;
		}

		vx += (mouseX - x) * spring;
		vy += (mouseY - y) * spring;
		vx *= friction;
		vy *= friction;

		v += sqrt(vx * vx + vy * vy) - v;
		v *= 0.6;

		oldR = r;
		r = brushSize - v;

		for (let i = 0; i < splitNum; ++i) {
			oldX = x;
			oldY = y;
			x += vx / splitNum;
			y += vy / splitNum;
			oldR += (r - oldR) / splitNum;
			if (oldR < 1) {
				oldR = 1;
			}
			strokeWeight(oldR + diff);
			line(x, y, oldX, oldY);
			strokeWeight(oldR);
			line(
				x + diff * 1.5,
				y + diff * 2,
				oldX + diff * 2,
				oldY + diff * 2
			);
			line(x - diff, y - diff, oldX - diff, oldY - diff);
		}
	} else if (f) {
		vx = vy = 0;
		f = false;
	}
}
