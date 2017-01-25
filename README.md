# etk
The Evalution ToolKit is designed to automate image-based perceptual experiments.  Developed under a DOE grant by the ECX Collaboration, this software is targeted at researchers in scientific visualization. 

The software modules work within Qualtrics survey software.  Each module consists of three scripts: a JavaScript, a CSS file and an HTML file that are added to a Qualtrics project/question.  The researcher needs to minimally edit the code (e.g. changing the list of images and modifying some sizes to fit the images under study) to create a basic psychophysical experiment.  Any necessary image randomization is automatically done within the JavaScript and output is via Qualtrics Embedded Data variables.  

There are currently four modules which can be used for different types of psychophysical methods:
1) 2 Alternative Forced Choice - compares a set of images to a baseline image randomly chosen from a set of possible baselines.
2) Method of Adjustment - cycles through a "carousel" of images
3) Round Robin Comparison - compares all images pairwise; includes option for a set of validation images
4) Compare 2 Arrays - compares images in two lists; can be used in a 2AFC type of experiment or to hardcode a subset of a round robin set of comparison. 
5) Click Counting - counts the number of clicks on an image.  Can be used for counting types of studies.  

Please see the EvaluationToolKitREADME for more details on using the ETK. The ETK-Checklist.docx file provides a useful checklist of steps needed to implement an ETK module.  

This material is based upon work supported by Dr. Lucy Nowell of the U.S. Department of Energy Office of Science, Advanced Scientific 
Computing Research under Award Numbers DE-AS52-06NA25396 and DE-SC-0012516. 

This code is licensed under a BSD 3-Clause License.
Copyright (c) 2016, University of Texas at Austin, Los Alamos National Laboratory.
All rights reserved.

Primary Developer: Terry Turton
tlturton@cat.utexas.edu

 
