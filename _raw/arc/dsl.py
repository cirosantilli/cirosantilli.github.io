#!/usr/bin/env python

import argparse
from fractions import Fraction
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

            ioWidthRatios.append(Fraction(outputWidth, inputWidth))
            ioHeightRatios.append(Fraction(outputHeight, inputHeight))

        inputConstraints = []
        outputConstraints = []

        if all_equal(inputWidths):
            w = inputWidths[0]
            inputConstraints.append(('fixedWidth', lambda dsl: dsl['width'] != w and f'{dsl['width']} != {w}'))
        if all_equal(inputHeights):
            h = inputHeights[0]
            inputConstraints.append(('fixedHeight', lambda dsl: dsl['height'] != h and f'{dsl['height']} != {h}'))
        
        # Output width inference.
        for isWidth in [True, False]:
            if isWidth:
                outputs = outputWidths
                ioRatios = ioWidthRatios
                wh_str = 'width'
            else:
                outputs = outputHeights
                ioRatios = ioHeightRatios
                wh_str = 'height'
            outputsEqual = all_equal(outputs)
            outputRatiosEqual = all_equal(ioRatios)
            if outputsEqual or outputRatiosEqual:
                def f(dsl_i, dsl_o):
                    expect = outputs[0]
                    r = ioRatios[0]
                    w = dsl_o[wh_str]
                    expectRatio = dsl_i[wh_str] * r.numerator // r.denominator
                    actualRatio = w
                    if expect != w and expectRatio != actualRatio:
                        return f'actual: {w} fixed expect: {expect} ratio expect: {expectRatio}'
                outputConstraints.append((f'{wh_str}FixedOrRatio', f))
            else:
                print(f'{id}: unknown output {wh_str} rule {ioRatios}')

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
