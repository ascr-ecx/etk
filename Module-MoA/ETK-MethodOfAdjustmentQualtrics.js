/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/

// Add after: Qualtrics.SurveyEngine.addOnload call

/* 
The Method of Adjustment module can be used to find a discrimination 
threshold in a series of images where the stimuli is changing.

The image array will need to be modified for the user specific images.
  
This code assumes a single Embedded Data variable in the Qualtrics study, 
named "Count1".  This should be modified for each MoA module in the actual
user study.  Each Embedded Data variable must be added in the Survey Flow. 

Place this code in the embedded JavaScript location for each Method of Adjustment
question.
*/
	
// Edit the image list and URL as needed.
// Each stimuli level will chosen from multiple possible variants for that level.
var imgURL = "http://000.0.00.00/TestImages/ValueVarying/"
var allBaseNames = [ 
	["value00-00.png", "value00-01.png", "value00-02.png", "value00-03.png", "value00-04.png"],
	["value01-00.png", "value01-01.png", "value01-02.png", "value01-03.png", "value01-04.png"],
	["value03-00.png", "value03-01.png", "value03-02.png", "value03-03.png", "value03-04.png"],
	["value05-00.png", "value05-01.png", "value05-02.png", "value05-03.png", "value05-04.png"],
	["value10-00.png", "value10-01.png", "value10-02.png", "value10-03.png", "value10-04.png"],
	["value15-00.png", "value15-01.png", "value15-02.png", "value15-03.png", "value15-04.png"],
	["value25-00.png", "value25-01.png", "value25-02.png", "value25-03.png", "value25-04.png"]
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
var nextTxt = document.createTextNode("NEXT>");
var prevBtn = document.createElement("BUTTON");
var prevTxt = document.createTextNode("<PREV");

nextBtn.className = "cycleButton rightButton";
prevBtn.className = "cycleButton leftButton";
nextBtn.setAttribute = ("type", "radio");
prevBtn.setAttribute = ("type", "radio");
nextBtn.appendChild(nextTxt);
prevBtn.appendChild(prevTxt);

var choiceName = "Count1";
var currentImage = 0;
var imgIndex = 0; 

// Create misc variables
var timeDelay = 250;  // number of milliseconds pause before next image is shown
var doTimeDelay = false; // implement option to turn on/off time delay
var doImageNumber = false; // implement option to turn on/off the image counter above the image

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

	if (doImageNumber) {  // flag to show an image number at the top of the image
		var imageTextTitle = "IMAGE NUMBER: ";
		var titleDiv = document.createElement('DIV');
		var text = document.createTextNode(imageTextTitle + imageNum);
		titleDiv.className = "imageTitle";
		titleDiv.appendChild(text);
		inContainer.appendChild(titleDiv); 
	}

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

function clearContainer(elementID) {
    while (elementID.firstChild) {
		elementID.removeChild(elementID.firstChild)}
}

// Begin Method of Adjustment 

// Build an array from the stimuli images, choosing one stimuli image per level from each set of variants.
// Feed those into the baseNames[].
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

// Showing initial image 
show1Image(glbContainer, imgContainer, imgs[0], 0 );

// Click "Next" button to see next image
nextBtn.addEventListener('click', function() {
	clearContainer(imgContainer);
	imgIndex++;
	if (imgIndex == imgs.length) {
	imgIndex = 0;
	}
	show1Image(glbContainer, imgContainer, imgs[imgIndex], imgIndex);
	Qualtrics.SurveyEngine.setEmbeddedData(choiceName,imgIndex);
});

// Click "Prev" button to see previous image
prevBtn.addEventListener('click', function() {
	clearContainer(imgContainer);
	imgIndex--;
	if (imgIndex == -1) {
	imgIndex = imgs.length - 1;
	} 
	show1Image(glbContainer, imgContainer, imgs[imgIndex], imgIndex);
	Qualtrics.SurveyEngine.setEmbeddedData(choiceName,imgIndex);
});

/*
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
