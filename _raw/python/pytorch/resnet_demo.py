#!/usr/bin/env python

# https://cirosantilli.com/torchvision-resnet

import os.path
import sys

from torchvision.io.image import read_image
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2, FasterRCNN_ResNet50_FPN_V2_Weights
from torchvision.utils import draw_bounding_boxes
from torchvision.transforms.functional import to_pil_image

inpath = sys.argv[1]
outpath = sys.argv[2]
img = read_image(inpath)

# Step 1: Initialize model with the best available weights
weights = FasterRCNN_ResNet50_FPN_V2_Weights.DEFAULT
model = fasterrcnn_resnet50_fpn_v2(weights=weights, box_score_thresh=0.9)
model.eval()

# Step 2: Initialize the inference transforms
preprocess = weights.transforms()

# Step 3: Apply inference preprocessing transforms
batch = [preprocess(img)]

# Step 4: Use the model and visualize the prediction
prediction = model(batch)[0]
labels = [weights.meta["categories"][i] for i in prediction["labels"]]
print(labels)
box = draw_bounding_boxes(
    img,
    boxes=prediction["boxes"],
    labels=labels,
    colors="green",
    width=4
)
im = to_pil_image(box.detach())
inpath_bname, inpath_ext = os.path.splitext(inpath)
im.save(outpath)
