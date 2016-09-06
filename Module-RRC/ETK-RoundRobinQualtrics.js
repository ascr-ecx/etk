// Add after: Qualtrics.SurveyEngine.addOnload call
/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/
/* 
The Round Robin Comparison module will do a pairwise comparison of all the 
listed images.  Each pair of images will be pairwise randomized (left/right vs.
right/left) and the presentation order of pairs is also randomized.  

The image arrays will need to be modified for the user specific images.

The prefixes and code for the Embedded Data can also be changed as needed 
to fit the specific variable names defined by the user.  
*/

// Image names/URLs will need to be updated by user.
var imgs = [ 
"http://146.6.82.10/TestImages/Image00.png",
"http://146.6.82.10/TestImages/Image01.png",
"http://146.6.82.10/TestImages/Image02.png",
"http://146.6.82.10/TestImages/Image03.png",
"http://146.6.82.10/TestImages/Image04.png"
];
var imgNames = ["Image00", "Image01", "Image02", "Image03", "Image04"];

// Add validation pair here if used.
// Set valsExists to false if no validation pair used.
valsExists = true;
valsIndex = 0;
var vals = [ 
"http://146.6.82.10/TestImages/Validation0.png",
"http://146.6.82.10/TestImages/Validation1.png"
];
var valsNames = ["Val00", "Val01"];
	
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

var imgPairs = [];
var imgPairsIndex = 0;  
var imgPairNames = [];
var didflip = false;
var that;
var choicePre = "c";
var choiceEmbData;
var namePre = "n";
var nameEmbData;

function shuffle(array) {  // Fisher-Yates Shuffle from stackoverflow
    var currentIndex = array.length, temporaryValue, randomIndex;
	
    while (0 !== currentIndex) { // While there remain elements to shuffle...

     // Pick a remaining element...
     randomIndex = Math.floor(Math.random() * currentIndex); 
     currentIndex -= 1;

     // And swap it with the current element.
     temporaryValue = array[currentIndex];
     array[currentIndex] = array[randomIndex];
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

// Start Round Robin
that = this;
that.hideNextButton();
clearContainer(container);

// Use an array of objects to determine which images are to be shown.
for (i= 0; i<imgs.length; i++) { // build the pairs 
	for (j = i+1; j<imgs.length; j++) {
		createImagePairing (i, j);
	}
}

// If there is a validation pair, add those to the imgPairs to get 
// randomly shuffled.
if (valsExists) {
	valsIndex = imgs.length;
	imgs.push (vals[0]);
	imgs.push (vals[1]);
	imgPairs.push ({iA: valsIndex, iB: valsIndex+1, 
	               iAname: valsNames[0], iBname: valsNames[1]});
}

shuffle(imgPairs);

// Showing initial image pair
nextBtn.disabled = true;
didflip = show2Images(document.getElementById('imageContainer'), imgs[imgPairs[0].iA], imgs[imgPairs[0].iB]);
imgPairNames[imgPairsIndex] = imgPairs[imgPairsIndex].iAname + "-" + imgPairs[imgPairsIndex].iBname;
if (didflip) {
	imgPairNames[imgPairsIndex] = imgPairs[imgPairsIndex].iBname + "-" + imgPairs[imgPairsIndex].iAname;
}
	
// Click "Next" button to see next image pair
nextBtn.addEventListener('click', function() {
	clearContainer(container);
	leftBtn.style.backgroundColor = "burlywood";
	rightBtn.style.backgroundColor = "burlywood";	
	nextBtn.style.backgroundColor = "burlywood";
	nextBtn.disabled = true;
	imgPairsIndex++;
	if (imgPairsIndex < imgPairs.length) {
		didflip = show2Images(container, imgs[imgPairs[imgPairsIndex].iA], imgs[imgPairs[imgPairsIndex].iB]);
		imgPairNames[imgPairsIndex] = imgPairs[imgPairsIndex].iAname + "-" + imgPairs[imgPairsIndex].iBname;
		if (didflip) {
			imgPairNames[imgPairsIndex] = imgPairs[imgPairsIndex].iBname + "-" + imgPairs[imgPairsIndex].iAname;
		}
	} else {
		endStudy(container);
	}
});

leftBtn.addEventListener('click', function(){
 // Note choice for Left Button 
	leftBtn.style.backgroundColor = "red";
	rightBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	choiceEmbData = choicePre + imgPairsIndex;
	Qualtrics.SurveyEngine.setEmbeddedData(choiceEmbData, 1);
	nameEmbData = namePre + imgPairsIndex;
	Qualtrics.SurveyEngine.setEmbeddedData(nameEmbData, imgPairNames[imgPairsIndex]);
 });
 rightBtn.addEventListener('click', function(){
 // Note choice for Right Button
	rightBtn.style.backgroundColor = "red";
	leftBtn.style.backgroundColor = "burlywood";
	nextBtn.style.backgroundColor = "GreenYellow";
	nextBtn.disabled = false;
	choiceEmbData = choicePre + imgPairsIndex;
	Qualtrics.SurveyEngine.setEmbeddedData(choiceEmbData, 2);
	nameEmbData = namePre + imgPairsIndex;
	Qualtrics.SurveyEngine.setEmbeddedData(nameEmbData, imgPairNames[imgPairsIndex]);
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
