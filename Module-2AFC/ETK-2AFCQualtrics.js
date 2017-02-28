// Add after: Qualtrics.SurveyEngine.addOnload call

/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/
/* The 2 Alternative Forced Choice module is used to run a 2AFC experiment.  
The module assumes that there is a set of baseline images and a set of stimuli images. Each stimuli image level may
consist of multiple variants.  The baseline images are in a single array.  One baseline image will be randomly chosen 
to be used in each comparison.  The stimuli images are an array of arrays where the first index is the stimuli level 
and the second index goes over the level variants.  An array of single stimuli images, one for each level of the 
stimuli, will be built from one randomly chosen variant image from each level.  
The image arrays will need to be modified for the user specific images.  

The prefixes and code for the Embedded Data can also be changed as needed 
to fit the specific variable names defined by the user.  
*/


// List of Baseline and Stimuli images.  
// One Stimuli image for each level will be chosen from each set of variants and that will be compared to 
// one of the possible Baseline images. 
// If a Baseline image should be compared to one of the Baseline images (typical 2AFC procedure), then the set of 
// Baseline images should be included as one of the possible sets of Stimuli images.  
// The test images vary the value from V=0 (black) through varying shades of grey.  There are five variants for 
// each value level (value**-00 through value**-04).

var imgURL = "http://000.0.00.00/TestImages/ValueVarying/";
var allBaselineNames = [ 
"value00-00.png",
"value00-01.png",
"value00-02.png",
"value00-03.png",
"value00-04.png"
];
var allStimuliNames = [
	["value00-00.png", "value00-01.png", "value00-02.png", "value00-03.png", "value00-04.png"],
	["value05-00.png", "value05-01.png", "value05-02.png", "value05-03.png", "value05-04.png"],
	["value10-00.png", "value10-01.png", "value10-02.png", "value10-03.png", "value10-04.png"],
	["value15-00.png", "value15-01.png", "value15-02.png", "value15-03.png", "value15-04.png"],
	["value25-00.png", "value25-01.png", "value25-02.png", "value25-03.png", "value25-04.png"],
	["value35-00.png", "value35-01.png", "value35-02.png", "value35-03.png", "value35-04.png"],
	["value45-00.png", "value45-01.png", "value45-02.png", "value45-03.png", "value45-04.png"],
];
var stmliNames = [], whichStmli;
var bases = [], baseNames = [];
var imgs = [], imgNames = [];
var whichBase;
	
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
	var someSpace = document.createTextNode("xxxxx");
	flipped = false;

	inContainer.style.color = "#CCCCCC";
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
	inContainer.appendChild(blankBtn);
	inContainer.appendChild(rightBtn);
	inContainer.appendChild(document.createElement('br'));
	inContainer.appendChild(nextBtn);
	
	outContainer.appendChild(inContainer);
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

// Build an array from the stimuli images, choosing one stimuli image per level from each set of variants.
// Feed those into the stmliNames[].
for (var i = 0; i < allStimuliNames.length; i++) {
	whichStmli = Math.floor(allStimuliNames[i].length*Math.random());
	stmliNames[i] = allStimuliNames[i][whichStmli];
}

// Build the image arrays from the URL, baseNames and stmliNames array; preload images
// Shuffle the images, choose a random baseline for each of the stimuli level images
// creating an array of image pairs.
for (var i=0; i<stmliNames.length; i++) {
	imgs[i] = imgURL + stmliNames[i];
	imgNames.push( {iIndex: i, sName: stmliNames[i], iName: imgs[i], iResult: -1} );
}
for (var i=0; i<allBaselineNames.length; i++) {
	bases[i] = imgURL + allBaselineNames[i];
	baseNames.push( {iIndex: i, bName: allBaselineNames, iName: bases[i], iResult: -1} );
}
preloadImages(imgs);
preloadImages(bases);
clearContainer(imgContainer);

// Use an array of objects to determine which image pairs are to be shown.
// Shuffle the images. Choose one of the baseline images.  Build pairs.
shuffle(imgNames);
for (var j = 0; j<imgNames.length; j++) { 
	whichBase = Math.floor(bases.length*Math.random());
	imgPairs[j] =  ({iA: whichBase, iB: j, iAname: baseNames[whichBase].iName, iBname: imgNames[j].iName});
}

// Showing initial image pair
nextBtn.disabled = true;
didflip = show2Images(glbContainer, imgContainer, imgPairs[0].iAname, imgPairs[0].iBname);
	
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
	didflip = show2Images(glbContainer, imgContainer, imgPairs[imgPairsIndex].iAname, imgPairs[imgPairsIndex].iBname);
	} else {
		endStudy(imgContainer);
// Write output to Embedded Data Variables in image order; 
		Qualtrics.SurveyEngine.setEmbeddedData(nameAllOneSide, allLeft||allRight);
		for (var iLoop = 0; iLoop<stmliNames.length; iLoop++) {
			origIndex = findOrigIndex(imgNames, "iIndex", iLoop);
			choiceEmbData = choicePre + iLoop;
			nameEmbData = namePre + iLoop;
			currentName = imgNames[origIndex].sName;
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
