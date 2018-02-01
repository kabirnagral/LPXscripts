function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

function myAccFunc(element) {
    var x = document.getElementById(element);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-green";
    } else {
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className =
        x.previousElementSibling.className.replace(" w3-green", "");
    }
}
// function myAccFunc1() {
//     var x = document.getElementById("Acc");
//     if (x.className.indexOf("w3-show") == -1) {
//         x.className += " w3-show";
//         x.previousElementSibling.className += " w3-green";
//     } else {
//         x.className = x.className.replace(" w3-show", "");
//         x.previousElementSibling.className =
//         x.previousElementSibling.className.replace(" w3-green", "");
//     }
// }
// function myAccFunc2() {
//     var x = document.getElementById("Acc1");
//     if (x.className.indexOf("w3-show") == -1) {
//         x.className += " w3-show";
//         x.previousElementSibling.className += " w3-green";
//     } else {
//         x.className = x.className.replace(" w3-show", "");
//         x.previousElementSibling.className =
//         x.previousElementSibling.className.replace(" w3-green", "");
//     }
// }
