import cv2
import os
import sys
import pytesseract

imagename = sys.argv[1]

# parameter for image to scan/process
args_image = './public/uploads/'+imagename
print(args_image)
# read the image
image = cv2.imread(args_image)
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
outText = pytesseract.image_to_string(image, lang = 'eng', config='--psm 1 -c preserve_interword_spaces=1')
f = open("./public/uploads/temp.txt",'w',-1, "utf-8")
f.write(outText)
f.close()