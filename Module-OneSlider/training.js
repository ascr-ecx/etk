/*
This code is licensed under a BSD 3-Clause License.
Original KeyTask code:
Copyright (c) 2017, University of Texas at Austin, Los Alamos National Laboratory.
 All rights reserved.
 
 Contributor: Terry Turton

Modification to SliderTask:
Copyright (c) 2018, University of Texas at Austin. All rights reserved.

Contributors: Ayat Mohammed, Paul Navratil

 */
 /*
  Copyright (c) 2017, University of Texas at Austin, Los Alamos National Laboratory.
  Copyright (c) 2018, University of Texas at Austin.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
                                 

/* The SliderTask module displays a stimuli image with a colormap and slider positioned underneath.  
The images are shown in a random order up to a maximum denoted by the variable
 `maxShow`.  
 
 The image array and URL will need to be modified for the user specific images.
 The prefixes and code for the Embedded Data can also be changed as needed
 to fit the specific variable names defined by the user. The defaults are to embed `nX` and `FG_X`,
 where X is the ordinal for the image presented to the user, as defined by the embedded var `ImgInd`.
 */

Qualtrics.SurveyEngine.addOnload(function()
{
   // TODO: example image URL and image names. Update these with your image links
   var imgURL ="https://utexas.qualtrics.com/ControlPanel/Graphic.php?IM="; 
   var baseNames = [
     'IM_50hMqyPyiIzM8N7',
     'IM_eh5wmMMix1Utszj', 
     'IM_3VqEXBdNzp485XT', 
     'IM_87IpLBi27xpZFZ3'
   ];


   var imgIndex;
   var imgs = [];
   maxShow = 1;// 99;  // Show a random subsample of up to maxShow

   // Create containers, attach global container to Qualtrics Question Container
   var inContainer = document.getElementById('imageContainer');
   var inContainer2 = document.getElementById('colormapContainer');
   inContainer.style.width = "550px";
   var glbContainer =  this.getQuestionContainer();
   var quesText = document.getElementById('myQuesText');
   inContainer.className = "imageBox";
     inContainer2.className = "colormapBox";
 
  
   // Create "Next Image" button with needed attributes and text
   var nextBtn = document.createElement("BUTTON");
   var nextTxt = document.createTextNode("NEXT IMAGE>");
   nextBtn.className = "nextButton";
   nextBtn.setAttribute = ("type", "radio");
   nextBtn.appendChild(nextTxt);

   var backgroundColor ="#948872";// "#848484"; // also need to update in CSS if this is changed.
                 
  var sliderChoices = [];
  var sliderChoices2 = [];

  // Create variables for write-out to Qualtrics Embedded Data
  var choicePre = "training_FG_";
  var namePre = "trainingN";
  var choiceEmbData;
  var nameEmbData;
  var currentName = " ";
  var currentChoice;
  var that;

  // Create misc variables
  var timeDelay = 250;  // number of milliseconds pause before next image pair is shown

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

  function show1Image(outContainer, inContainer, image, index) {

    inContainer.style.color = backgroundColor;
    inContainer.style.backgroundColor = backgroundColor;

    var img1 = document.createElement("img");
    img1.id = "stimuli";
    img1.src = image;
    img1.style.width = "500px";
    img1.style.height = "500px";

    // TODO: update the cmap_src with a link to the color map for the first slider
    var cmap = document.createElement("img");
    var cmap_src="https://utexas.ca1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_3PdDz0hzLN9Yrel";
    cmap.src = cmap_src;
    cmap.id = "colormap";

    var sld  = document.createElement("input");
    sld.type = 'range';
    sld.min = 0;
    sld.max = 1;
    sld.step = .001;
    sld.value = 0;
    sld.className = "slider";
    //sld.style.orient = "vertical";
    sld.id = "Range1" ;

    inContainer.appendChild(img1);
    inContainer2.appendChild(cmap);
    inContainer2.appendChild(sld);
    inContainer2.appendChild(nextBtn);
    inContainer.appendChild(inContainer2);                           
                
    
    var slider1 = document.getElementById("Range1");
    slider1.addEventListener("change", 
       function() { 
        sliderChoices[index] = slider1.value;  
        console.log(sliderChoices[index]);
        })
    console.log(sliderChoices[index]);
  }


  function clearContainer(elementID) {
    while (elementID.firstChild) {
      elementID.removeChild(elementID.firstChild) 
    }
  }

  function endStudy(container) {
    var endTextTitle = document.createTextNode("Thank you for doing the training!  You are ready to take the survey.  Click on Next when you are ready to begin.");
    var docFrag = document.createDocumentFragment();

    var imgInd = Number(Qualtrics.SurveyEngine.getEmbeddedData('ImgInd'));
    var indexEmbData = imgInd;
    quesText.style.display = "none";
    container.style.backgroundColor ="#DDB78A";
    container.style.color = "#000000";
    container.style.fontSize="110%";
    //container.style.fontWeight="bold" ;
    docFrag.appendChild(endTextTitle);
    container.appendChild(docFrag);

    for (i=0; i<Math.min(maxShow,baseNames.length); i++) { // write out info

      nameEmbData = namePre + indexEmbData;
      choiceEmbData = choicePre + indexEmbData;
      currentName = imgs[i];  // name is currently full link to image; can be modified by user as appropriate
      currentChoice = sliderChoices[i];
      console.log(nameEmbData, " ", currentName, " ", choiceEmbData, " ", currentChoice);
      Qualtrics.SurveyEngine.setEmbeddedData(nameEmbData, currentName);
      Qualtrics.SurveyEngine.setEmbeddedData(choiceEmbData, currentChoice);

    }//end for

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
     sliderChoices[i] = "Z";
   }
   preloadImages(imgs);
   clearContainer(inContainer);
   clearContainer(inContainer2);

   // Show initial image
   imgIndex = 0;
   show1Image(glbContainer, inContainer, imgs[imgIndex], imgIndex);

   // Click "Next" button to see next image if a sliderChoice has been made.
   //$('NextButton')
   nextBtn.addEventListener('click',
      function() {
        if (sliderChoices[imgIndex] != "Z") { 
          clearContainer(inContainer);
          clearContainer(inContainer2);
          imgIndex++;
          if (imgIndex < Math.min(maxShow,imgs.length)) {
            show1Image(glbContainer, inContainer, imgs[imgIndex], imgIndex);
          } else {
            endStudy(inContainer);
          }
        }
      });


 });