#!/usr/bin/env python

import os
from torchvision import datasets

data_dir = 'data'
png_dir = os.path.join(data_dir, 'MNIST', 'png')
for train in [True, False]:
    train_test_dir = os.path.join(png_dir, 'train' if train else 'test')
    for i, (image, label) in enumerate(
        datasets.MNIST(root=data_dir, train=train, download=True)
    ):
        label_dir = os.path.join(train_test_dir, str(label))
        os.makedirs(label_dir, exist_ok=True)
        image.save(os.path.join(label_dir, f'{i}.png'))
        if i % 1000 == 0:
            print(f"{i}")
