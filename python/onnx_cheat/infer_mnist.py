#!/usr/bin/env python

# https://docs.ourbigbook.com/activatedgeek-lenet-5-use-onnx-for-inference

import json
import sys

import numpy as np
import cv2
import onnxruntime

model = sys.argv[1]
paths = sys.argv[2:]
for path in paths:
    img = cv2.imread(path)
    img = np.dot(img[...,:3], [0.299, 0.587, 0.114])
    img = cv2.resize(img, dsize=(32, 32), interpolation=cv2.INTER_AREA)
    img.resize((1, 1, 32, 32))
    data = json.dumps({'data': img.tolist()})
    data = np.array(json.loads(data)['data']).astype('float32')
    session = onnxruntime.InferenceSession(model, None)
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    result = session.run([output_name], {input_name: data})
    prediction=int(np.argmax(np.array(result).squeeze(), axis=0))
    print(prediction)
