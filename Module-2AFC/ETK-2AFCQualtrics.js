// Add after: Qualtrics.SurveyEngine.addOnload call

/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/
/* The 2 Alternative Forced Choice module is used to run a 2AFC 
experiment against a single baseline image.  The baseline image must be
the first in the list of Test images.  The baseline image will be shuffled 
into the list of Test images so there will be a bseline vs. baseline comparison.

The image arrays will need to be modified for the user specific images.
The code snippets which extract the image names will also need to be 
modified.  
The prefixes and code for the Embedded Data can also be changed as needed 
to fit the specific variable names defined by the user.  
*/


// List of Test images.  Baseline is first image by default.
// Baseline will be compared to itself and each of the Test images.
var imgURL = "http://000.0.00.00/TestImages/"
var baseNames = [ 
"Image00",
"Image01",
"Image02",
"Image03",
"Image04"
];
var imgs = [];
var imgNames = [];
	
// Create containers, attach global container to Qualtrics Question Container
var imgContainer = document.getElementById('imageContainer');
var glbContainer =  this.getQuestionContainer();
var quesText = document.getElementById('myQuesText')
imgContainer.className = "pairBox";

// Create buttons with needed attributes and text
var leftBtn = document.createElement("BUTTON");
var rightBtn = document.createElement("BUTTON");
var nextBtn = document.createElement("BUTTON");
var nextText = document.createTextNode("NEXT Image Pair");
var leftText = document.createTextNode("LEFT");
var rightText = document.createTextNode("RIGHT");

nextBtn.className = "nextButton";
leftBtn.className = "choiceButton leftButton";
rightBtn.className = "choiceButton rightButton";
leftBtn.setAttribute = ("type", "radio");
rightBtn.setAttribute = ("type", "radio");
nextBtn.appendChild(nextText);
leftBtn.appendChild(leftText);
rightBtn.appendChild(rightText);

var imgPairs = [];
var imgPairsIndex = 0;  
var imgPairNames = [];
var didflip = false;
var currentIndex = 0;
var that;

// Create variables for write-out to Qualtrics Embedded Data 
var choicePre = "c";
var choiceEmbData;
var namePre = "n";
var nameEmbData;
var currentName = " ";
var currentChoice;

// Create variables to check if participant only selects one button 
var allLeft = true;
var allRight = true;
var nameAllOneSide = "AllOneSide";

function preloadImages(arr){ // preload imaegs
    var newimages=[]
	//force arr parameter to always be an array
    for (var i=0; i<arr.length; i++){
    var arr=(typeof arr!="object")? [arr] : arr 
        newimages[i]=new Image()
        newimages[i].src=arr[i]
    }
}

function shuffle(array) {  // Fisher-Yates Shuffle from stackoverflow
    var arrIndex = array.length, temporaryValue, randomIndex;
	
    while (0 !== arrIndex) { // While there remain elements to shuffle...

     // Pick a remaining element...
     randomIndex = Math.floor(Math.random() * arrIndex); 
     arrIndex -= 1;

     // And swap it with the current element.
     temporaryValue = array[arrIndex];
     array[arrIndex] = array[randomIndex];
     array[randomIndex] = temporaryValue;
   }
  return array;
}

function show2Images(outContainer, inContainer, imgA, imgB) { 
// Add two images to the study container; randomly show the images
// as A vs. B or B vs. A
	var img;
	var docFrag = document.createDocumentFragment();
	var someSpace = document.createTextNode("  ");
	flipped = false;

	if (Math.random() < 0.5) {
		docFrag.appendChild(someSpace);
		docFrag.appendChild(img=document.createElement('img')).src = imgA;
		docFrag.appendChild(someSpace);
		docFrag.appendChild(img=document.createElement('img')).src = imgB;
	} else {
		flipped = true;
		docFrag.appendChild(someSpace);
		docFrag.appendChild(img=document.createElement('img')).src = imgB;
		docFrag.appendChild(someSpace);
	    docFrag.appendChild(img=document.createElement('img')).src = imgA;
	}
	inContainer.appendChild(docFrag);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(leftBtn);
	inContainer.appendChild(rightBtn);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(nextBtn);
	
	outContainer.appendChild(inContainer);
	return flipped;
}

function createImagePairing (firstImageNum, secondImageNum) {
	imgPairs.push ({iA: firstImageNum, iB: secondImageNum, 
	                 iAname: imgNames[firstImageNum], iBname: imgNames[secondImageNum]});
}

function clearContainer(elementID) {
    while (elementID.firstChild) {
		elementID.removeChild(elementID.firstChild)}
}

function endStudy(inContainer) {
	var endTextTitle = document.createTextNode("Please click on SUBMIT to record your choices.");
	var docFrag = document.createDocumentFragment();
	
	quesText.style.display = "none";
	inContainer.style.backgroundColor = "#CC5500";
	inContainer.style.fontSize="200%";
	inContainer.style.fontWeight="bold" ;
	docFrag.appendChild(endTextTitle); 
	inContainer.appendChild(docFrag);
	that.showNextButton();
}

function findOrigIndex (arr, key, iSearchValue) {
	for (var ii = 0; ii<arr.length; ii++) {
		if (arr[ii][key] == iSearchValue) {
			return ii;
		}
	}
	return null;
}

// Start 2 Alternative Forced Choice

that = this;
that.hideNextButton();

// Build the image arrays from the URL and names; preload images
// Create an array of indices, shuffle that and 
// always compare the two images with same index.
for (i=0; i<baseNames.length; i++) {
	imgs[i] = imgURL + baseNames[i];
	imgNames.push( {iIndex: i, iName: baseNames[i], iResult: -1} );
}
preloadImages(imgs);
clearContainer(imgContainer);

// Use an array of objects to determine which image pairs are to be shown.
// Base image must be imgs[0].  Shuffle the image pairs.
for (j = 0; j<imgs.length; j++) { 
	createImagePairing (0, j);
}
shuffle(imgPairs);

// Showing initial image pair
nextBtn.disabled = true;
didflip = show2Images(glbContainer, imgContainer, imgs[imgPairs[0].iA], imgs[imgPairs[0].iB]);
	
// Click "Next" button to see next image pair
nextBtn.addEventListener('click', function() {

	clearContainer(imgContainer);
	leftBtn.style.backgroundColor = "burlywood";
	rightBtn.style.backgroundColor = "burlywood";	
	nextBtn.style.backgroundColor = "burlywood";
	nextBtn.disabled = true;
	imgPairsIndex++;
	currentIndex = imgPairsIndex;
	if (imgPairsIndex < imgPairs.length) {
		didflip = show2Images(glbContainer, imgContainer, imgs[imgPairs[imgPairsIndex].iA], imgs[imgPairs[imgPairsIndex].iB]);
	} else {
		endStudy(imgContainer);
		Qualtrics.SurveyEngine.setEmbeddedData("AllOneSide", allLeft||allRight);
// Write output to Embedded Data Variables in image order; 
		for (var iLoop = 0; iLoop<imgNames.length; iLoop++) {
			origIndex = findOrigIndex(imgNames, "iIndex", iLoop);
			choiceEmbData = choicePre + iLoop;
			nameEmbData = namePre + iLoop;
			currentName = imgNames[origIndex].iName;
			currentChoice = imgNames[origIndex].iResult;
	        Qualtrics.SurveyEngine.setEmbeddedData(nameEmbData, currentName);		
	        Qualtrics.SurveyEngine.setEmbeddedData(choiceEmbData, currentChoice);
		}
	}
});

leftBtn.addEventListener('click', function(){
 // Note choice for Left Button; by default Baseline is LEFT
	leftBtn.style.backgroundColor = "white";
	rightBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	allRight = false;
	if (didflip) {
		imgNames[currentIndex].iResult = 0;  // non-Baseline chosen
	} else {
		imgNames[currentIndex].iResult = 1;  // Baseline chosen
	};
 });
 rightBtn.addEventListener('click', function(){
 // Note choice for Right Button; by default diff image is RIGHT
	rightBtn.style.backgroundColor = "white";
	leftBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	allLeft = false;
	if (didflip) {
		imgNames[currentIndex].iResult = 1;  // Baseline chosen
	} else {
		imgNames[currentIndex].iResult = 0;  // non-Baseline chosen
	};
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
