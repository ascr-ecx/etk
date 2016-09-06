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

var imgsBase = [ 
"http://000.0.00.00/TestImages/True00",
"http://000.0.00.00/TestImages/True01",
"http://000.0.00.00/TestImages/True02",
"http://000.0.00.00/TestImages/True03",
"http://000.0.00.00/TestImages/True04"
];
var imgsDiff = [ 
"http://000.0.00.00/TestImages/False00",
"http://000.0.00.00/TestImages/False01",
"http://000.0.00.00/TestImages/False02",
"http://000.0.00.00/TestImages/False03",
"http://000.0.00.00/TestImages/False04"
];

var imgNames = [];
var imgIndex  = [];
var currentIndex = 0;
var tempName = " ";
var nameLen = 0;
	
var container = document.getElementById('imageContainer');
var quesText = document.getElementById('myQuesText')
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

var didflip = false;
var that;
var choicePre = "c";
var choiceEmbData;
var namePre = "n";
var nameEmbData;
var currentName = " ";
var currentChoice;

var origIndex;

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

function show2Images(container, imgA, imgB) { 
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
	container.appendChild(docFrag);
	container.appendChild(document.createElement('br'));
	container.appendChild(leftBtn);
	container.appendChild(rightBtn);
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(nextBtn);
	return flipped;
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

// Start: Compare two arrays
that = this;
that.hideNextButton();
preloadImages(imgsBase);
preloadImages(imgsDiff);
clearContainer(container);

// Create an array of indices, shuffle that and 
// always compare the two images with same index.

// Need to extract image name; this will need to be 
// modified as appropriate for the specific image path/name. 
for (i=0; i<imgsBase.length; i++) {
	nameLen = imgsBase[i].length;
	tempName = imgsBase[i].slice(30,nameLen);
	imgNames.push( {iIndex: i, iName: tempName, iResult: -1} );
}
shuffle(imgNames);

// Showing initial image pair
nextBtn.disabled = true;
currentIndex = 0;
didflip = show2Images(document.getElementById('imageContainer'), 
			imgsBase[imgNames[currentIndex].iIndex], imgsDiff[imgNames[currentIndex].iIndex]);
	
// Click "Next" button to see next image pair
nextBtn.addEventListener('click', function() {
	clearContainer(container);
	leftBtn.style.backgroundColor = "burlywood";
	rightBtn.style.backgroundColor = "burlywood";	
	nextBtn.style.backgroundColor = "burlywood";
	nextBtn.disabled = true;
	currentIndex++;
	if (currentIndex < imgNames.length) {
		didflip = show2Images(document.getElementById('imageContainer'), imgsBase[imgNames[currentIndex].iIndex], 
		           imgsDiff[imgNames[currentIndex].iIndex]);
	} else {
		endStudy(container);
// Write output to Embedded Data Variables in image order:
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
 // Note choice for Left Button ==> Default is BASE image
	leftBtn.style.backgroundColor = "white";
	rightBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	if (didflip) {
		imgNames[currentIndex].iResult = 0;
	} else {
		imgNames[currentIndex].iResult = 1;
	};
 });
 rightBtn.addEventListener('click', function(){
 // Note choice for Right Button ==> Default is FAIL image
	rightBtn.style.backgroundColor = "white";
	leftBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
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
