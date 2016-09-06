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
var imgs = [
"http://000.0.00.00/TestImages/Image00.png",
"http://000.0.00.00/TestImages/Image01.png",
"http://000.0.00.00/TestImages/Image02.png",
"http://000.0.00.00/TestImages/Image03.png",
"http://000.0.00.00/TestImages/Image04.png"
];

var container = document.getElementById('imageContainer');
var nextBtn = document.createElement("BUTTON");
var nextTxt = document.createTextNode("NEXT>");
nextBtn.appendChild(nextTxt);
var prevBtn = document.createElement("BUTTON");
var prevTxt = document.createTextNode("<PREV");
prevBtn.appendChild(prevTxt);

nextBtn.className = "cycleButton rightButton";
prevBtn.className = "cycleButton leftButton";

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

function show1Image(container, image, imageNum) { 
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
//	container.appendChild(titleDiv); 

	docFrag.appendChild(img=document.createElement('img')).src = image;
	container.appendChild(docFrag);
	container.appendChild(document.createElement('br'));
	container.appendChild(prevBtn);
	container.appendChild(nextBtn);
}

function clearContainer(elementID) {
    while (elementID.firstChild) {
		elementID.removeChild(elementID.firstChild)}
}
// Preload images to avoid flickering onload
preloadImages(imgs);

// Showing initial image 
show1Image(document.getElementById('imageContainer'), imgs[0], 0 );

// Click "Next" button to see next image
nextBtn.addEventListener('click', function() {
	clearContainer(container);
	imgIndex++;
	if (imgIndex == imgs.length) {
	imgIndex = 0;
	}
	show1Image(container, imgs[imgIndex], imgIndex);
	Qualtrics.SurveyEngine.setEmbeddedData("Count1",imgIndex);
});

// Click "Prev" button to see previous image
prevBtn.addEventListener('click', function() {
	clearContainer(container);
	imgIndex--;
	if (imgIndex == -1) {
	imgIndex = imgs.length - 1;
	} 
	show1Image(container, imgs[imgIndex], imgIndex);
	Qualtrics.SurveyEngine.setEmbeddedData("Count1",imgIndex);
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
