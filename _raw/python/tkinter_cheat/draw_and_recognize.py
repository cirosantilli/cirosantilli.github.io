#!/usr/bin/env python

import signal
import sys

from tkinter import *

def start_drawing(event):
    global last_x, last_y, drawing
    last_x, last_y = event.x, event.y
    drawing = True

def draw(event):
    global last_x, last_y
    if drawing:
        x, y = event.x, event.y
        canvas.create_line(
            last_x,
            last_y,
            x,
            y,
            capstyle=ROUND,
            fill='black',
            smooth=TRUE,
            splinesteps=36,
            width=10,
        )
        last_x, last_y = x, y

def stop_drawing(event):
    global drawing
    drawing = False

def doClear():
    global canvas
    canvas.delete("all")

w = 400
cmdsH = w//10
clearW = w//2
font = 'Times 14'

ui = Tk()
ui.title('Painting Canvas')
ui.geometry('{}x{}'.format(w, w + cmdsH))
ui.pack_propagate(False)
drawing = False

canvas = Canvas(ui, bg="white")
canvas.pack(fill=BOTH, expand=True)
canvas.place()
canvas.bind("<Button-1>", start_drawing)
canvas.bind("<B1-Motion>", draw)
canvas.bind("<ButtonRelease-1>", stop_drawing)

bar = Frame(ui, width=w, height=cmdsH)
bar.pack(padx=0, pady=0)
clear = Button(
    bar,
    command=doClear,
    font=font,
    height=100,
    text="Clear",
    width=19,
)
clear.place(x=0, height=30, anchor='nw')
label = Label(bar, height=5, width=20, font=font, text='', anchor='w')
def setLabel(txt):
    label['text'] = txt
setLabel('111')
label.place(x=w/2, height=30, anchor='nw')

# TODO https://stackoverflow.com/questions/39840815/exiting-a-tkinter-app-with-ctrl-c-and-catching-sigint#:~:text=You%20can%20then%20use%20Ctrl,use%20Tkinter%20in%20your%20code).
#signal.signal(signal.SIGINT, lambda x, y: sys.exit())
ui.bind('<Escape>', lambda ev: sys.exit())
ui.mainloop()
