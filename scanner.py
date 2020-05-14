import cv2
import os
import numpy as np
import imutils
import sys
imagename = sys.argv[1]

# parameter for image to scan/process
args_image = './public/uploads/'+imagename
print(args_image)
# read the image
image = cv2.imread(args_image)
orig = image.copy()
# convert image to gray scale. This will remove any color noise
grayImage = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
grayImage = cv2.GaussianBlur(grayImage,(3,3),0)
edged = cv2.Canny(grayImage,75,200) #canny edge경계검출
cnts,heirarchy = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = sorted(cnts,key=cv2.contourArea, reverse=True)[:5]

for c in cnts:
    peri=cv2.arcLength(c,True)
    vertices = cv2.approxPolyDP(c,0.02*peri,True)
    if(len(vertices)==4):
        break

pts = vertices.reshape(4,2)# N x 1 x 2 배열을 4x2크기로 조정

sm = pts.sum(axis=1)
diff = np.diff(pts,axis=1)

topLeft = pts[np.argmin(sm)]
bottomright = pts[np.argmax(sm)]
topRight = pts[np.argmin(diff)]
bottomLeft = pts[np.argmax(diff)]
pts1 = np.float32([topLeft, topRight, bottomright, bottomLeft]) #변환전 4개 좌표 
w1 = abs(bottomright[0]-bottomLeft[0])
w2 = abs(topRight[0]-bottomright[0])
h1 = abs(topRight[1]-bottomright[1])
h2 = abs(topLeft[1]-bottomLeft[1])
width = max([w1,w2])
height=max([h1,h2])

pts2 = np.float32([
    [0,0], 
    [width-1,0],
    [width-1,height-1],
    [0,height-1]
])
mtrx = cv2.getPerspectiveTransform(pts1,pts2)
result = cv2.warpPerspective(image, mtrx, (width,height))
result = cv2. cv2.cvtColor(result, cv2.COLOR_BGR2GRAY)
cv2.imwrite('./public/uploads/'+sys.argv[1],result)
