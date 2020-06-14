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
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
cv2.imwrite(args_image,gray)
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
outText = pytesseract.image_to_string(gray, lang = 'eng+kor', config='--psm 1 -c preserve_interword_spaces=1')
f = open("./public/uploads/temp.txt",'w',-1, "utf-8")
f.write(outText)
f.close()