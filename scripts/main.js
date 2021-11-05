const sectionThree = document.querySelector('.section3');

const options = {};

const observer = new IntersectionObserver(function (entries, observer) {
	entries.forEach(entry => {
		console.log(entry);
	});
}, options);

observer.observe(sectionThree);
