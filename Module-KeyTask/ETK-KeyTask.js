// Add after: Qualtrics.SurveyEngine.addOnload call

/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2017, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Contributor: Terry Turton

*/
/* The KeyTask module displays a stimuli image with an array of possible answer keys.  The keys can
be identified by colors or names.  The images are shown in a random order up to a maximum denoted by the variable
maxShow.  A keyFlag variable toggles between color keys or named keys.  There are 16 keys in the default version.
If using a different number, the three arrays, keyColors, keyValues and keyNames, will need to be updated to
reflect the correct number of items.  

The image array and URL will need to be modified for the user specific images. 
The prefixes and code for the Embedded Data can also be changed as needed 
to fit the specific variable names defined by the user.  
*/
var imgURL = "http://000.0.00.00/TestImages/"
var baseNames = [ 
"KTimage00.png",
"KTimage01.png",
"KTimage02.png",
"KTimage03.png",
"KTimage04.png",
"KTimage05.png",
"KTimage06.png"
];
var imgIndex; 
var imgs = [];
maxShow = 99;  // Show a random subsample of up to maxShow 

// Create containers, attach global container to Qualtrics Question Container
var inContainer = document.getElementById('imageContainer');
var glbContainer =  this.getQuestionContainer();
var quesText = document.getElementById('myQuesText')
inContainer.className = "imageBox";

// Create "Next Image" button with needed attributes and text
var nextBtn = document.createElement("BUTTON");
var nextTxt = document.createTextNode("NEXT IMAGE>");
nextBtn.className = "nextButton";
nextBtn.setAttribute = ("type", "radio");
nextBtn.appendChild(nextTxt);

/* Make a choice for how the keys are identified.  Do they show colors or names/text?  
If using keyNames, keyColors defaults to the same HEX color. 
The flag defaults to colors. */
/* This code uses 16 keys.  If the user wishes to change the number of keys, then KeyColors, KeyNames & KeyValues
will need to be updated to reflect the number of keys and their colors/names/values. */

//var keyFlag = "names"; 
var keyFlag = "colors"; 
var backgroundColor = "#848484"; // also need to update in CSS if this is changed.  

// Create variables needed for color-indexed buttons; defaults to white background
var keyValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var keyColors = [
"#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF",
"#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
var keyNames = ["A","B","C","D","E","F","G","H", "I","J","K","L","M","N","O","P"];
switch (keyFlag) {  // if colors, use same name so all same size (avoids Qualtrics font override issues)
	case "colors" :
		var keyNames = ["A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A"];
		var keyColors = [
		"#0F0F0F", "#262626", "#393939", "#4B4B4B", "#5C5C5C", "#6C6C6C", "#7C7C7C", "#8B8B8B",
		"#9A9A9A", "#A8A8A8", "#B6B6B6", "#C4C4C4", "#D2D2D2", "#DFDFDF", "#ECECEC", "#F9F9F9"];
		break;
}
var keyChoices = [];

// Create variables for write-out to Qualtrics Embedded Data 
var choicePre = "c";
var choiceEmbData;
var namePre = "n";
var nameEmbData;
var currentName = " ";
var currentChoice;
var that;

function preloadImages(arr){
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

function show1Image(outContainer, inContainer, image, index, kFlag, kColors, kNames, kValues) { 
	var img;
	var docFrag = document.createDocumentFragment();
	var docText = document.createTextNode("spacess");

	inContainer.style.color = backgroundColor;
	docFrag.appendChild(docText);
	docFrag.appendChild(img=document.createElement('img')).src = image;
	inContainer.appendChild(docFrag);
	inContainer.appendChild(document.createElement('br'))
	generateKeys(kFlag, kColors, kNames, kValues, inContainer, index);	
	inContainer.appendChild(document.createElement('br'))
	inContainer.appendChild(nextBtn);

	outContainer.appendChild(inContainer);
}

var generateKeys = function(kFlag, kColors, kNames, kValues, container, index) {
	var keyButtonDiv = document.createElement('DIV');  // parent for buttons

	for (var i = 0; i < kValues.length; i++) {
		var keyButton = document.createElement('BUTTON');
			keyButton.type = "radio";
			keyButton.name = "choices";
			keyButton.className = "keyButtons";
			keyButton.style.backgroundColor = kColors[i];
			keyButton.style.color = "#000000"  // text color is black by default
			if (kFlag == "colors") {  // make text color same as button color so text is hidden
				keyButton.style.color = kColors[i];
			}
			keyButton.style.fontSize="200%";
			keyButton.style.fontWeight="bold" ;
			keyButton.style.borderColor = backgroundColor;
			keyButton.value = i;
			keyButton.id = kValues[i];
			thisBtnTxt = kNames[i];
		var keyButtonText = document.createTextNode(thisBtnTxt);
			keyButtonText.id = "c" + i;
		
		keyButton.appendChild (keyButtonText);
		keyButtonDiv.appendChild(keyButton)
		container.appendChild(keyButtonDiv);
		var myBtns = document.getElementsByTagName('button');
//		console.log(myBtns);
		keyButtonDiv.addEventListener("click", function(event) {
			for (var jj = 0; jj<myBtns.length-1; jj++) {
				myBtns[jj].style.borderColor = backgroundColor;
			}
			keyChoices[index] = event.target.id;
			var curElement = document.activeElement;
			curElement.style.borderColor = "black";
		}, false);	
	}	
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
	container.style.color = "#000000";
	container.style.fontSize="200%";
	container.style.fontWeight="bold" ;
	docFrag.appendChild(endTextTitle); 
	container.appendChild(docFrag);
	for (i=0; i<Math.min(maxShow,baseNames.length); i++) { // write out info
		nameEmbData = namePre + i;
		choiceEmbData = choicePre + i;
		currentName = imgs[i];  // name is currently full link to image; can be modified by user as appropriate
		currentChoice = keyChoices[i];
		console.log(nameEmbData, " ", currentName, " ", choiceEmbData, " ", currentChoice);
        Qualtrics.SurveyEngine.setEmbeddedData(nameEmbData, currentName);	
        Qualtrics.SurveyEngine.setEmbeddedData(choiceEmbData, currentChoice);	
	}	
	that.showNextButton();  // Reveal the Qualtrics button to move to next question
}

// Begin Key Task

// For Qualtrics: hide the button to move to next question
that = this;
that.hideNextButton();

// Create image array from URL and list of image names; 
// Shuffle images; preload images to avoid flickering onload;
// Get ground truth info from the file name
shuffle(baseNames);
for (i=0; i<baseNames.length; i++) {
	imgs[i] = imgURL + baseNames[i];
	keyChoices[i] = "Z";
}
preloadImages(imgs);
clearContainer(inContainer);

// Show initial image 
imgIndex = 0;
show1Image(glbContainer, inContainer, imgs[imgIndex], imgIndex, keyFlag, keyColors, keyNames, keyValues);

// Click "Next" button to see next image if a keyChoice has been made.
nextBtn.addEventListener('click', function() {	
	if (keyChoices[imgIndex] != "Z") {
		clearContainer(inContainer);
		imgIndex++;
		if (imgIndex < Math.min(maxShow,imgs.length)) {
			show1Image(glbContainer, inContainer, imgs[imgIndex], imgIndex, keyFlag, keyColors, keyNames, keyValues);
			} else {
			endStudy(inContainer);
		}
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
