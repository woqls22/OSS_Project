import os
import sys
imagename = sys.argv[1]
file = './public/uploads/'+imagename
if os.path.isfile(file):
    os.remove(file)
'''
    f = open("./public/uploads/temp.txt",'w',-1, "utf-8")
    f.write(outText)
'''