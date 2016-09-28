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
	
// Edit the image list as needed.
var imgURL = "http://000.0.00.00/TestImages/";
var baseNames = [ 
"Image00",
"Image01",
"Image02",
"Image03",
"Image04"
];
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
	var img;
	var docFrag = document.createDocumentFragment();

/* This section will add a title with the Image Number incrementing at the top
of the carousel box.  Uncomment it if you wish to have the image number available	
*/	
//	var imageTextTitle = "IMAGE NUMBER: ";
//	var titleDiv = document.createElement('DIV');
//	var text = document.createTextNode(imageTextTitle + imageNum);
//	titleDiv.className = "imageTitle";
//	titleDiv.appendChild(text);
//	inContainer.appendChild(titleDiv); 

	docFrag.appendChild(img=document.createElement('img')).src = image;
	inContainer.appendChild(docFrag);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(prevBtn);
	inContainer.appendChild(nextBtn);
	
	outContainer.appendChild(inContainer);
}

function clearContainer(elementID) {
    while (elementID.firstChild) {
		elementID.removeChild(elementID.firstChild)}
}

// Begin Method of Adjustment 

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
