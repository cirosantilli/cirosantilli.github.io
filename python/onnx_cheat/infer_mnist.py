#!/usr/bin/env python

# https://cirosantilli.com/activatedgeek-lenet-5-use-onnx-for-inference

import sys

import numpy as np
np.set_printoptions(threshold=sys.maxsize)
np.set_printoptions(linewidth=np.inf)

import onnxruntime
from PIL import Image

model = sys.argv[1]
paths = sys.argv[2:]
session = onnxruntime.InferenceSession(model, None)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name
for path in paths:
    # The final input to onnx is a 1x1x32x32 float32 numpy array
    # with values between 0.0 and 255.0
    img = Image.open(path)
    img = img.resize((32, 32), Image.LANCZOS)
    img = np.array([[img]])
    # The resolution is so small that we can actually visualize
    # it really well on the terminal.
    #print(img)
    img = img.astype('float32')

    result = session.run([output_name], { input_name: img })
    prediction=np.argmax(np.array(result).squeeze(), axis=0)
    print(prediction)
