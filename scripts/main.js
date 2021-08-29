/*let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/body.jpg') {
        myImage.setAttribute('src','images/body2.jpg');
    } else {
        myImage.setAttribute('src','images/body.jpg')
    }
}*/

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1')

function setUserName() {
    let myName = prompt('Please enter your name.');
    localStorage.setItem('name', myName);
    myHeading.textContent = 'Mozillla is cool, ' + myName;
}

myButton.onclick = function() {
    setUserName();
}