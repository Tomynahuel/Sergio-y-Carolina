var imgs = document.querySelectorAll('#slider .image');
var currentImg = 0; // index of the first image 
const interval = 5000; // duration(speed) of the slide
var timer = setInterval(changeSlide, interval);

function changeSlide(n) {
    for (var i = 0; i < imgs.length; i++) { // reset
        imgs[i].style.opacity = 0;
    }

    currentImg = (currentImg + 1) % imgs.length; // update the index number

    if (n != undefined) {
        clearInterval(timer);
        timer = setInterval(changeSlide, interval);
        currentImg = n;
    }
    imgs[currentImg].style.opacity = 1;
}