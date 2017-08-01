/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2017, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/

// Add after: Qualtrics.SurveyEngine.addOnload call

/* 
The Sliding Method of Adjustment module can be used to find a discrimination 
threshold in a series of images where the stimuli is changing.

The image array will need to be modified for the user specific images.
  
This code assumes two Embedded Data variables in the Qualtrics study, 
named ImageL and ImageR.  This may need to be modified for each MoA module in an actual
user study.  Each Embedded Data variable must be added in the Qualtrics Survey Flow. 

Place this code in the embedded JavaScript location for each 
Sliding Method of Adjustment question.
*/

// Edit the image list as needed.
// Training set for sliding MoA
var imgURL = "http://000.0.00.00/TestImages/MovingLine/";
var allBaseNames = [
	["Moving150Line0.png", "Moving150Line1.png", "Moving150Line2.png"],
	["Moving190Line0.png", "Moving190Line1.png", "Moving190Line2.png"],
	["Moving230Line0.png", "Moving230Line1.png", "Moving230Line2.png"],
	["Moving270Line0.png", "Moving270Line1.png", "Moving270Line2.png"],
	["Moving310Line0.png", "Moving310Line1.png", "Moving310Line2.png"],
	["Moving350Line0.png", "Moving350Line1.png", "Moving350Line2.png"]
];	
var baseNames = [];
var imgs = [];

// Create containers, attach global container to Qualtrics Question Container
var imgContainer = document.getElementById('imageContainer');
var glbContainer =  this.getQuestionContainer();
var quesText = document.getElementById('myQuesText')
imgContainer.className = "carouselBox";

// Create buttons with needed attributes and text
var nextBtn = document.createElement("BUTTON");
var nextTxt = document.createTextNode("LEFT >>");
var prevBtn = document.createElement("BUTTON");
var prevTxt = document.createTextNode("<< RIGHT");
var prevTxt = document.createTextNode("<< RIGHT");

nextBtn.className = "cycleButton rightButton";
prevBtn.className = "cycleButton leftButton";
nextBtn.setAttribute = ("type", "radio");
prevBtn.setAttribute = ("type", "radio");
nextBtn.appendChild(nextTxt);
prevBtn.appendChild(prevTxt);

var choiceName0 = "ImageL";
var choiceName1 = "ImageR";
var imgIndex = 0; 
var start = true;
var forward = true;
var pairs = [];

// Create misc variables
var timeDelay = 200;  // number of milliseconds pause before next image is shown
var doTimeDelay = false; // implement option to turn on/off time delay

function preloadImages(arr){
    var newimages=[]
	//force arr parameter to always be an array
    for (var i=0; i<arr.length; i++){
    var arr=(typeof arr!="object")? [arr] : arr 
        newimages[i]=new Image()
        newimages[i].src=arr[i]
    }
}

function show1Image(outContainer, inContainer, image, imageNum) { 
	var img = document.createElement("img");
	var docFrag = document.createDocumentFragment();

	img.src = image;
	if (doTimeDelay) {  // flag to put a delay between the images
		img.style.opacity = 0.0;
		img.style.filter  = 'alpha(opacity=0)'; // IE fallback
}	else {
		img.style.opacity = 1.0;
		img.style.filter  = 'alpha(opacity=100)'; // IE fallback
	}
	
	docFrag.appendChild(img);
	inContainer.appendChild(docFrag);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(prevBtn);
	inContainer.appendChild(nextBtn);
	
	outContainer.appendChild(inContainer);
	setTimeout(function() {
	img.style.opacity = 1.0;
	img.style.filter  = 'alpha(opacity=100)'; // IE fallback
	}, timeDelay);
}

function show2Images(outContainer, inContainer, imgA, imgB) { 
// Add two images to the study container; randomly show the images
// as A vs. B or B vs. A
	var img1 = document.createElement("img");
	var img2 = document.createElement("img");
	var docFrag = document.createDocumentFragment();
	var someSpace = document.createTextNode("xxxx");

	inContainer.style.color = "#D3D3D3";
	img1.src = imgA;
	img2.src = imgB;

	if (doTimeDelay) {  // flag to put a delay between the images
		img1.style.opacity = 0.0;
		img2.style.opacity = 0.0;
		img1.style.filter  = 'alpha(opacity=0)'; // IE fallback
		img2.style.filter  = 'alpha(opacity=0)'; // IE fallback
}	else {
		img1.style.opacity = 1.0;
		img2.style.opacity = 1.0;
		img1.style.filter  = 'alpha(opacity=100)'; // IE fallback
		img2.style.filter  = 'alpha(opacity=100)'; // IE fallback
}
	docFrag.appendChild(img1);
	docFrag.appendChild(someSpace);
	docFrag.appendChild(img2);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(docFrag);
	inContainer.appendChild(prevBtn);
	inContainer.appendChild(nextBtn);
	
	outContainer.appendChild(inContainer);
	setTimeout(function() {
	img1.style.opacity = 1.0;
	img2.style.opacity = 1.0;
	img1.style.filter  = 'alpha(opacity=100)'; // IE fallback
	img2.style.filter  = 'alpha(opacity=100)'; // IE fallback
	}, timeDelay);
}

function clearContainer(elementID) {
    while (elementID.firstChild) {
		elementID.removeChild(elementID.firstChild)}
}

// Begin sliding Method of Adjustment 
that = this;
// Build an array from the stimuli images, choosing one stimuli image per level from each set of variants.
// Feed those into the baseNames[] array.
for (var i = 0; i < allBaseNames.length; i++) {
	whichStmli = Math.floor(allBaseNames[i].length*Math.random());
	baseNames[i] = allBaseNames[i][whichStmli];
}
// Create image array from URL and list of image names; 
// Preload images to avoid flickering onload
for (i=0; i<baseNames.length; i++) {
	imgs[i] = imgURL + baseNames[i];
}
preloadImages(imgs);
for (i=0; i<imgs.length-1; i++) {
	pairs[i] = {i1: i, i2: i+1}; 
}

// Showing initial image 
show2Images(glbContainer, imgContainer, imgs[pairs[0].i1], imgs[pairs[0].i2] );
prevBtn.style.backgroundColor = "darkred";

// Click "Next" button to see next image
nextBtn.addEventListener('click', function() {
	clearContainer(imgContainer);
	nextBtn.style.backgroundColor = "burlywood";
	prevBtn.style.backgroundColor = "burlywood";
	start = false;
	imgIndex++;
	if (imgIndex == imgs.length-1) {
		nextBtn.style.backgroundColor = "darkred";
		imgIndex--;
	} else {
//
	}
	show2Images(glbContainer, imgContainer, imgs[pairs[imgIndex].i1], imgs[pairs[imgIndex].i2] );
	Qualtrics.SurveyEngine.setEmbeddedData(choiceName0,baseNames[pairs[imgIndex].i1]);
	Qualtrics.SurveyEngine.setEmbeddedData(choiceName1,baseNames[pairs[imgIndex].i2]);
});

// Click "Prev" button to see previous image
prevBtn.addEventListener('click', function() {
	clearContainer(imgContainer);
	nextBtn.style.backgroundColor = "burlywood";
	prevBtn.style.backgroundColor = "burlywood";
	if (start) {
		start = false;
	} else {
		imgIndex--;
	}
	show2Images(glbContainer, imgContainer, imgs[pairs[imgIndex].i1], imgs[pairs[imgIndex].i2] );
	Qualtrics.SurveyEngine.setEmbeddedData(choiceName0,baseNames[pairs[imgIndex].i1]);
	Qualtrics.SurveyEngine.setEmbeddedData(choiceName1,baseNames[pairs[imgIndex].i2]);
	if (imgIndex == 0) {
		prevBtn.style.backgroundColor = "darkred";
		start = true;
	}
});

/*
Copyright (c) 2017, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/