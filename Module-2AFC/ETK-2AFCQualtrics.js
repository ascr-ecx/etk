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
var imgs = [
"http://000.0.00.00/TestImages/Image00.png",
"http://000.0.00.00/TestImages/Image01.png",
"http://000.0.00.00/TestImages/Image02.png",
"http://000.0.00.00/TestImages/Image03.png",
"http://000.0.00.00/TestImages/Image04.png"
];

var imgNames = [];
	
var container = document.getElementById('imageContainer');
var quesText = document.getElementById('myQuesText');
var leftBtn = document.createElement("BUTTON");
var leftText = document.createTextNode("LEFT");
leftBtn.appendChild(leftText);
var rightBtn = document.createElement("BUTTON");
var rightText = document.createTextNode("RIGHT");
rightBtn.appendChild(rightText);
var nextBtn = document.createElement("BUTTON");
var nextText = document.createTextNode("NEXT Image Pair");
nextBtn.appendChild(nextText);

leftBtn.className = "choiceButton leftButton";
rightBtn.className = "choiceButton rightButton";
nextBtn.className = "nextButton";

var imgPairs = [];
var imgPairsIndex = 0;  
var imgPairNames = [];
var didflip = false;
var that;
var choicePre = "c";
var choiceEmbData;
var namePre = "n";
var nameEmbData;
var currentIndex = 0;

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

function show2Images(container, imgA, imgB) { 
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
	container.appendChild(docFrag);
	container.appendChild(document.createElement('br'));
	container.appendChild(leftBtn);
	container.appendChild(rightBtn);
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(nextBtn);
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

function endStudy(container) {
	var endTextTitle = document.createTextNode("Please click on SUBMIT to record your choices.");
	var docFrag = document.createDocumentFragment();
	
	quesText.style.display = "none";
	container.style.backgroundColor = "#CC5500";
	container.style.fontSize="200%";
	container.style.fontWeight="bold" ;
	docFrag.appendChild(endTextTitle); 
	container.appendChild(docFrag);
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
clearContainer(container);

// Need to extract image name; this will need to be 
// modified as appropriate for the specific image path/name. 
for (i=0; i<imgs.length; i++) {
	nameLen = imgs[i].length;
	tempName = imgs[i].slice(30,nameLen);
	imgNames.push( {iIndex: i, iName: tempName, iResult: -1} );
}

// Use an array of objects to determine which image pairs are to be shown.
// Base image must be imgs[0].  Shuffle the image pairs.
for (j = 0; j<imgs.length; j++) { 
	createImagePairing (0, j);
}
shuffle(imgPairs);

// Showing initial image pair
nextBtn.disabled = true;
didflip = show2Images(document.getElementById('imageContainer'), imgs[imgPairs[0].iA], imgs[imgPairs[0].iB]);
	
// Click "Next" button to see next image pair
nextBtn.addEventListener('click', function() {

	clearContainer(container);
	leftBtn.style.backgroundColor = "burlywood";
	rightBtn.style.backgroundColor = "burlywood";	
	nextBtn.style.backgroundColor = "burlywood";
	nextBtn.disabled = true;
	imgPairsIndex++;
	currentIndex = imgPairsIndex;
	if (imgPairsIndex < imgPairs.length) {
		didflip = show2Images(container, imgs[imgPairs[imgPairsIndex].iA], imgs[imgPairs[imgPairsIndex].iB]);
	} else {
		endStudy(container);
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
