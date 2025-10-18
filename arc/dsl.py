#!/usr/bin/env python

import argparse
import json
from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path

@dataclass
class MonocolorObject:
    i: int
    j: int
    color: int
    pixel_indices: list[int] = field(default_factory=list)
    # Bounding box. We can check if the object is a perpendicular
    # line of width 1 from this, and give it much more importance in that case.
    min_i: Optional[int] = None
    min_j: Optional[int] = None
    max_i: Optional[int] = None
    max_j: Optional[int] = None

    def __post_init__(self):
        self.pixel_indices.append((self.i, self.j))
        self.min_i = self.i
        self.max_i = self.i
        self.min_j = self.j
        self.max_j = self.j

    def append(self, i, j):
        self.pixel_indices.append((i, j))
        if i < self.min_i:
            self.min_i = i
        if j < self.min_j:
            self.min_j = j
        if i > self.max_i:
            self.max_i = i
        if j > self.max_j:
            self.max_j = j

    def __len__(self):
        return len(self.pixel_indices)

    def __repr__(self):
        return f'i={self.i} j={self.j} color={self.color} len={len(self.pixel_indices)} pixel_indices={self.pixel_indices}'

def get_dsl(image):
    height = len(image)
    width = len(image[0])

    monocolorObjectsIndex = {
        # Perpendicular = false: counts diagonals as adjacent.
        False: {},
        # Perpendicular = true: does not count diagonals as adjacent.
        True: {},
    }
    monocolorObjects = {
        False: [],
        True: [],
    }
    for perpendicular in (True, False):
        index = monocolorObjectsIndex[perpendicular]
        list_ = monocolorObjects[perpendicular]
        for i in range(height):
            row = image[i]
            for j in range(width):
                color = row[j]
                if not (i, j) in index:
                    obj = MonocolorObject(i, j, color)
                    index[(i, j)] = obj
                    list_.append(obj)
                    todo = []
                    def append(i, j, color):
                        if i >= 0 and i < height and j >= 0 and j < width and image[i][j] == color:
                            if not (i, j) in index:
                                obj.append(i, j)
                                index[(i, j)] = obj
                                todo.append((i, j))
                    curi = i
                    curj = j
                    while True:
                        append(curi - 1, curj    , color)
                        append(curi    , curj - 1, color)
                        append(curi    , curj + 1, color)
                        append(curi + 1, curj    , color)
                        if not perpendicular:
                            append(curi - 1, curj - 1, color)
                            append(curi - 1, curj + 1, color)
                            append(curi + 1, curj - 1, color)
                            append(curi + 1, curj + 1, color)
                        if len(todo):
                            curi, curj = todo.pop()
                        else:
                            break
    return {
        'height': height,
        'monocolorObjectsIndex': monocolorObjectsIndex,
        'monocolorObjects': monocolorObjects,
        'width': width,
    }

def all_equal(l: list):
    return l.count(l[0]) == len(l)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('json-path', nargs='+')
    args = parser.parse_args()
    json_paths = getattr(args, 'json-path')
    for json_path in json_paths:
        id = Path(json_path).stem
        with open(json_path) as f:
            task = json.load(f)
        inputWidths = []
        inputHeights = []
        ioWidthRatios = []
        ioHeightRatios = []
        outputWidths = []
        outputHeights = []
        for i, io in enumerate(task['train']):
            #print(f'input {i}')
            input = io['input']
            inputWidth = len(input[0])
            inputWidths.append(inputWidth)
            inputHeight = len(input)
            inputHeights.append(inputHeight)
            input_dsl = get_dsl(input)
            #print(input_dsl)

            #print(f'output {i}')
            output = io['output']
            outputWidth = len(output[0])
            outputWidths.append(outputWidth)
            outputHeight = len(output)
            outputHeights.append(outputHeight)
            output_dsl = get_dsl(output)
            #print(output_dsl)

            ioWidthRatios.append((inputWidth, outputWidth))
            ioHeightRatios.append((inputHeight, outputHeight))

        inputConstraints = []
        outputConstraints = []

        if all_equal(inputWidths):
            w = inputWidths[0]
            inputConstraints.append(('fixedWidth', lambda dsl: dsl['width'] != w and f'{dsl['width']} != {w}'))
        if all_equal(inputHeights):
            h = inputHeights[0]
            inputConstraints.append(('fixedHeight', lambda dsl: dsl['height'] != h and f'{dsl['height']} != {h}'))
        if all_equal(ioWidthRatios):
            def f(dsl_i, dsl_o):
                i, o = ioWidthRatios[0]
                expect = dsl_i['width'] * o // i
                actual = dsl_o['width']
                if expect != actual:
                    return f'{expect} != {actual}'
            outputConstraints.append(('widthRatio', f))
        if all_equal(outputHeights):
            def f(dsl_i, dsl_o):
                i, o = ioHeightRatios[0]
                expect = dsl_i['height'] * o // i
                actual = dsl_o['height']
                if expect != actual:
                    return f'{expect} != {actual}'
            outputConstraints.append(('heightRatio', f))

        #for perpendicular in (True, False):
        #    for obj in sorted(monocolorObjects[perpendicular], key=lambda o: -len(o)):
        #        print(obj)

        for i, io in enumerate(task['test']):
            input = io['input']
            output = io['output']
            dsl_i = get_dsl(input)
            dsl_o = get_dsl(output)
            for name, inputConstraint in inputConstraints:
                msg = inputConstraint(dsl_i)
                if msg :
                    print(f'{id} {i}: input constraint {name} failed: {msg}')
            for name, outputConstraint in outputConstraints:
                msg = outputConstraint(dsl_i, dsl_o)
                if msg :
                    print(f'{id} {i}: output constraint {name} failed: {msg}')
