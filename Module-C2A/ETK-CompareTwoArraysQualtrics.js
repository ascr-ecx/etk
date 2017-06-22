// Add after: Qualtrics.SurveyEngine.addOnload call

/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/
/* The CompareTwoArrays module can be used in a 2AFC approach to 
compare two arrays where the stimuli is present in one image (Base) but 
missing or modified in the other (Diff).  An alternate use would be as
a Round Robin approach where the images to be compared to each other 
are explicitly listed.  

The image arrays will need to be modified for the user specific images.
The code snippets which extract the image names will also need to be 
modified.  
The prefixes and code for the Embedded Data can also be changed as needed 
to fit the specific variable names defined by the user.  
*/

var imgURL = "http://000.00.00.00/TestImages/";
var baselineNames = [ 
"True00",
"True01",
"True02",
"True03",
"True04"
];
var stmliNames = [ 
"False00",
"False01",
"False02",
"False03",
"False04"
];

var bases = [], baseNames = [];
var imgs = [], imgNames = [];
var imgIndex  = [];
var currentIndex = 0;
	
// Create containers, attach global container to Qualtrics Question Container
var imgContainer = document.getElementById('imageContainer');
var glbContainer =  this.getQuestionContainer();
var quesText = document.getElementById('myQuesText')
imgContainer.className = "pairBox";

// Create buttons with needed attributes and text
// blankBtn is used to add space between left/right buttons
var leftBtn = document.createElement("BUTTON");
var rightBtn = document.createElement("BUTTON");
var nextBtn = document.createElement("BUTTON");
var nextText = document.createTextNode("NEXT Image Pair");
var leftText = document.createTextNode("LEFT");
var rightText = document.createTextNode("RIGHT");
var blankBtn = document.createElement("BUTTON");

nextBtn.className = "nextButton";
leftBtn.className = "choiceButton leftButton";
rightBtn.className = "choiceButton rightButton";
blankBtn.className = "blankButton";
leftBtn.setAttribute = ("type", "radio");
rightBtn.setAttribute = ("type", "radio");
nextBtn.appendChild(nextText);
leftBtn.appendChild(leftText);
rightBtn.appendChild(rightText);

var didflip = false;
var that;
var origIndex;

// Create variables for write-out to Qualtrics Embedded Data 
var namePre = "n";
var nameEmbData;
var choicePre = "c";
var choiceEmbData;
var currentName = " ";
var currentChoice;

// Create variables to check if participant only selects one button 
var allLeft = true;
var allRight = true;
var nameAllOneSide = "AllOneSide";

// Create misc variables
var timeDelay = 250;  // number of milliseconds pause before next image pair is shown

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
	var img1 = document.createElement("img");
	var img2 = document.createElement("img");
	var docFrag = document.createDocumentFragment();
	var someSpace = document.createTextNode("xxxxx");
	flipped = false;

	inContainer.style.color = "#CCCCCC";
	if (Math.random() < 0.5) {
		img1.src = imgA;
		img2.src = imgB;
		} else {
		flipped = true;
		img2.src = imgA;
		img1.src = imgB;
	}
	img1.style.opacity = 0;
	img2.style.opacity = 0;
	img1.style.filter  = 'alpha(opacity=0)'; // IE fallback
	img2.style.filter  = 'alpha(opacity=0)'; // IE fallback

	docFrag.appendChild(someSpace);
	docFrag.appendChild(img1);
	docFrag.appendChild(someSpace);
	docFrag.appendChild(img2);
	inContainer.appendChild(docFrag);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(leftBtn);
	inContainer.appendChild(blankBtn);
	inContainer.appendChild(rightBtn);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(nextBtn);
	
	outContainer.appendChild(inContainer);
	setTimeout(function() {
	img1.style.opacity = 1.0;
	img2.style.opacity = 1.0;
	img1.style.filter  = 'alpha(opacity=100)'; // IE fallback
	img2.style.filter  = 'alpha(opacity=100)'; // IE fallback
	}, timeDelay);
		
	return flipped;
}

function clearContainer(elementID) {
    while (elementID.firstChild) {
		elementID.removeChild(elementID.firstChild)}
}

function endStudy(inContainer) {
	var endTextTitle = document.createTextNode("Please click on SUBMIT to record your choices.");
	var docFrag = document.createDocumentFragment();
	
	quesText.style.display = "none";
	inContainer.style.color = "Black";
	inContainer.style.backgroundColor = "#CC5500";
	inContainer.style.fontSize="200%";
	inContainer.style.fontWeight="bold" ;
	docFrag.appendChild(endTextTitle); 
	inContainer.appendChild(docFrag);
	that.showNextButton();  // Reveal the button to move to next question
}

function findOrigIndex (arr, key, iSearchValue) {
	for (var ii = 0; ii<arr.length; ii++) {
		if (arr[ii][key] == iSearchValue) {
			return ii;
		}
	}
	return null;
}

// Start: Compare 2 Arrays

// For Qualtrics: hide the button to move to next question
that = this;
that.hideNextButton();

// Build the image arrays from the URL and names; preload images
// Create an array of indices, shuffle that and 
// always compare the two images with same index.
for (i=0; i<baselineNames.length; i++) {
	bases[i] = imgURL + baselineNames[i];
	imgs[i] = imgURL + stmliNames[i];
	imgNames.push( {iIndex: i, iName: baselineNames[i], iResult: -1} );
}
preloadImages(imgs);
preloadImages(bases);
clearContainer(imgContainer);
shuffle(imgNames);

// Showing initial image pair
nextBtn.disabled = true;
currentIndex = 0;
didflip = show2Images(glbContainer, imgContainer, 
			bases[imgNames[currentIndex].iIndex], imgs[imgNames[currentIndex].iIndex]);
	
// Click "Next" button to see next image pair
nextBtn.addEventListener('click', function() {
	clearContainer(imgContainer);
	leftBtn.style.backgroundColor = "burlywood";
	rightBtn.style.backgroundColor = "burlywood";	
	nextBtn.style.backgroundColor = "white";
	nextBtn.disabled = true;
	currentIndex++;
	if (currentIndex < imgNames.length) {
		didflip = show2Images(glbContainer, imgContainer,
			bases[imgNames[currentIndex].iIndex], imgs[imgNames[currentIndex].iIndex]);
	} else {
		endStudy(imgContainer);
// Write output to Embedded Data Variables in image order:
		Qualtrics.SurveyEngine.setEmbeddedData(nameAllOneSide, allLeft||allRight);
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
 // Note choice for Left Button ==> Default is BASELINE image
	leftBtn.style.backgroundColor = "white";
	rightBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	allRight = false;
	if (didflip) {
		imgNames[currentIndex].iResult = 0;
	} else {
		imgNames[currentIndex].iResult = 1;
	};
 });
 rightBtn.addEventListener('click', function(){
 // Note choice for Right Button ==> Default is STMLI image
	rightBtn.style.backgroundColor = "white";
	leftBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	allLeft = false;
	if (didflip) {
		imgNames[currentIndex].iResult = 1;
	} else {
		imgNames[currentIndex].iResult = 0;
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
