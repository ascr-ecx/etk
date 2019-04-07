# The Evaluation Toolkit (etk)

<img src="https://github.com/ascr-ecx/etk/blob/master/img/icon.png" width="50"/>

**Contact:** Terry Turton tlturton@lanl.gov (primary developer)

**Website:** http://www.etklab.org

The Evalution ToolKit is designed to automate image-based perceptual experiments.  Developed under a DOE grant by the ECX Collaboration, this software is targeted at researchers in scientific visualization. 

The software modules work within Qualtrics survey software.  Each module consists of three scripts: a JavaScript, a CSS file and an HTML file that are added to a Qualtrics project/question.  The researcher needs to minimally edit the code (e.g. changing the list of images and modifying some sizes to fit the images under study) to create a basic psychophysical experiment.  Any necessary image randomization is automatically done within the JavaScript and output is via Qualtrics Embedded Data variables.  

There are currently six modules which can be used for different types of psychophysical methods:

* **Two-alternative Forced Choice** This compares a set of stimuli levels to a baseline; both the baseline and the stimuli images can come from an array of possible variants; each image in the comparison pair (baseline versus a stimuli level) will be randomly chosen from the respective set of variants.

* **Method of Adjustment** This cycles through a "carousel" of images.  The user can choose a threshold point.  

* **Sliding Method of Adjustment** This MoA variant shows two images as it rotates through the carousel of images, making it easier to see a threshold point.  

* **Round Robin Comparison** This compares all images pairwise; includes option for a set of validation images.

* **Compare 2 Arrays** This compares images in two lists; can be used in a 2AFC type of experiment or to hardcode a subset of a round robin set of comparison. 

* **Click Counting** This counts the number of clicks on an image.  Can be used for counting types of studies.  

* **Key Task** This shows a stimuli image with an array of 16 answer keys.  The keys can be coded by name or by color.  

## Documentation

The ETKlab website (http://www.etklab.org) has examples and demo surveys, as well as papers and other material in support of this toolkit. Take a look!

The ETK-Checklist.docx file provides a useful checklist of steps needed to implement an ETK module.  

Bibtex Citation:
@inproceedings {Turton:eurovisshort.20171131,
booktitle = {EuroVis 2017 - Short Papers},
editor = {Barbora Kozlikova and Tobias Schreck and Thomas Wischgoll},
title = {{ETK: An Evaluation Toolkit for Visualization User Studies}},
author = {Turton, Terece L. and Berres, Anne S. and Rogers, David H. and Ahrens, James},
year = {2017},
publisher = {The Eurographics Association},
ISBN = {978-3-03868-043-7},
DOI = {10.2312/eurovisshort.20171131}
}

## Qualtric Image Server Tip

When using image URLs for images residing in your Qualtrics Graphics Library (rather than on a separate server), you may need to modify the URL so it can be accessed by people taking the study.

Replace:
/Q/GraphicsSectionGraphic.php
with
/ControlPanel/Graphic.php

## Acknowledgement 

This material is based upon work supported by **Dr. Lucy Nowell** of the **U.S. Department of Energy Office of Science, Advanced Scientific 
Computing Research** under Award Numbers DE-AS52-06NA25396 and DE-SC-0012516. It is an artifact created for the ECX project (http://www.ecxproject.org)

## License

This code is licensed under a BSD 3-Clause License. Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory. All rights reserved. 

The icon for this project was downloaded from The Noun Project (www.nounproject.comr), and was created by Delwar Hossain.


 
