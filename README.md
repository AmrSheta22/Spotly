# Spotly

![Asset 4](https://user-images.githubusercontent.com/78879883/221129935-224c110a-c5e6-4714-8495-10a8cb7878db.png)

This is a chrome extension that marks the important words in paragraphs using multi-head attention in transformers inside a webpage, which makes it easier for the user to read and know what to focus on.

The project consists of two parts, the chrome extesion where you can find the front-end and push requests, which are sent to  the second part which is the flask api that uses BERT model to get the attension for every word and filter which one to be marked.

## requirments 
= python3
- chrome browser

## installation 
- first install the dependencies in requirments.txt 
pip install - r requirements.txt
- open chrome -> more tools -> extensions -> turn developer mode on then choose load unpacked and load the highlighting_extension folder 
- open flask_api.py by running it with python, this might take a long time on your first load.
python {download_directory}/flask_api.py
- pin the extension and have fun! <3
