	/*
This code is licensed under a BSD 3-Clause License.
Copyright (c) 2018, University of Texas at Austin. All rights reserved.

Contributors: Ayat Mohammed, Paul Navratil

 */
 /*
  Copyright (c) 2018, University of Texas at Austin.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
                                 
Qualtrics.SurveyEngine.addOnload(function()
	{

		var jq = jQuery.noConflict();
		var glbContainer =  this.getQuestionContainer();
		var container = document.getElementById("images");
		container.width = 610;
		container.height = 610;

		var canvas = document.createElement("CANVAS");
		canvas.width = 600;
		canvas.height = 600;
		canvas.id = "canvas1";
		var ctx = canvas.getContext("2d");
    var img1 = document.createElement("img");
    img1.id = "stimuli";
		var imageObj = new Image();

		imageObj.onload = function() {
			ctx.drawImage(imageObj, 0, 0);
		};

		// TODO: update the src lines below with a link to your target image
		imageObj.src = "https://utexas.qualtrics.com/CP/Graphic.php?IM=IM_5gyCJ6l1fq3zzBb" ;
		img1.src = "https://utexas.qualtrics.com/CP/Graphic.php?IM=IM_5gyCJ6l1fq3zzBb" ;
		container.appendChild(canvas);

	  glbContainer.appendChild(container);

		var clickCount = 0;

		jq("#canvas1").click(function(event)
		{
			var rect = this.getBoundingClientRect();
			var x = event.clientX -rect.left;
			var y = event.clientY -rect.top; 
			if (clickCount <6)
			{
				ctx.beginPath();
				ctx.arc(x, y, 5, 0, Math.PI * 2, true);
				ctx.stroke();
				clickCount+=1;
				console.log(rect.left,  rect.top,  event.clientX,  event.clientY, x, y);
			}
		});

	});
