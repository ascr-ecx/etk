
var myCanvas = document.getElementById("clickCanvas");
var ctx = myCanvas.getContext('2d');
var myImage = null;
var clicks = 0;

// Create variables for write-out to Qualtrics Embedded Data 
var nameEmbClicks = "nClicks";
var nameEmbColors = "Colors";

// Can only get pixel info if using image uploaded to Qualtrics server.
// If so, set useQualtricsServer to true and add the nameEmbColors variable as embedded data.
var useQualtricsServer = false;
var colorData = [];

function drawMyImage() {
	myImage = new Image();
	myImage.onload = function() {ctx.drawImage(myImage, 0, 0);	};
	myImage.src = "http://146.6.82.10/TestImages/fiveCircles.png" ;
	if (useQualtricsServer) {  // sample image on UT Qualtrics server:
		myImage.src = "https://utexas.qualtrics.com/CP/Graphic.php?IM=IM_b4s72QO2y405NAN";
	}
	myCanvas.addEventListener('click', addPoint, false);	
}
function addPoint(e) {
	if (useQualtricsServer) {
		getColorData(e);
	}
	ctx.beginPath();
	ctx.arc(e.offsetX,e.offsetY,3,0,2*Math.PI);
	ctx.strokeStyle = 'white';
	ctx.lineWidth=4;
	ctx.stroke();
	ctx.fill();
		
	clicks++;
	Qualtrics.SurveyEngine.setEmbeddedData(nameEmbClicks, clicks);

// Update this with appropriate text.
	document.getElementById("myCounter").innerHTML = "Number of circles found: " + clicks;
}

function getColorData(e) {
	var imgData = ctx.getImageData(e.offsetX,e.offsetY,1,1);
	var rgb = '{"r":'+imgData.data[0]+',"g":'+imgData.data[1]+',"b":'+imgData.data[2]+'}';
	colorData.push(rgb)
	Qualtrics.SurveyEngine.setEmbeddedData(nameEmbColors, colorData);
}

drawMyImage();
