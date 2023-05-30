# # import tflearn.contrib.framework.python.ops

# # contrib_add_arg_scope = tflearn.contrib.framework.python.ops.add_arg_scope

# from flask import Flask, render_template, request, jsonify
# import nltk
# from nltk.stem.lancaster import LancasterStemmer
# import numpy as np
# import tflearn
# # import tensorflow as tf
# import tensorflow as tf2

# import random
# import json
# import pickle
# import os

# app = Flask(__name__)

# stemmer = LancasterStemmer()

# with open("intents.json") as file:
#     data = json.load(file)

# with open("data.pickle", "rb") as f:
#     words, labels, training, output = pickle.load(f)

# def bag_of_words(s, words):
#     bag = [0 for _ in range(len(words))]

#     s_words = nltk.word_tokenize(s)
#     s_words = [stemmer.stem(word.lower()) for word in s_words]

#     for se in s_words:
#         for i, w in enumerate(words):
#             if w == se:
#                 bag[i] = 1

#     return np.array(bag)

# net = tflearn.input_data(shape=[None, len(training[0])])
# net = tflearn.fully_connected(net, 8)
# net = tflearn.fully_connected(net, 8)
# net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
# net = tflearn.regression(net)

# model = tflearn.DNN(net)
# model.load("model.tflearn")

# # Set debug mode
# app.debug = True

# app = Flask(__name__, template_folder='HomePage')

# @app.route('/')
# def index():
#     # template_dir = os.path.abspath('HomePage')
#     # return render_template(os.path.join(template_dir, 'home.html'))
#     return render_template('home.html')

# @app.route('/chatbot', methods=['GET', 'POST'])
# def get_bot_response():
#     if request.method == 'POST':
#         message = request.form['msg']
#     else:
#         message = request.args.get('msg')
        
#     print("Received message:", message)  # Add this line for debugging

#     if message:
#         message = message.lower()
#         response = get_response(message)
#         return jsonify(response)
    
#     # return jsonify("Missing Data!")

# def get_response(message):
#     global context

#     for intent in data['intents']: 
#         if 'patterns' in intent:
#             for pattern in intent['patterns']:
#                 if pattern.lower() in message:
#                     if 'context_set' in intent and intent['context_set'] != '':
#                         context['last_intent'] = intent['tag']
#                         context['last_context'] = intent['context_set']
#                     else:
#                         context = {}

#                     return random.choice(intent['responses'])

#     context = {}
#     return "I'm sorry, I don't understand. Can you please rephrase your statement or question?"


# if __name__ == "__main__":
#     app.run()


# def get_response(message):
#     global context

#     for intent in data['intents']:
#         if 'patterns' in intent:
#             for pattern in intent['patterns']:
#                 if pattern.lower() in message:
#                     # Check if there is a valid context for the current intent
#                     if 'context_set' in intent and intent['context_set'] != '':
#                         context['last_intent'] = intent['tag']
#                         context['last_context'] = intent['context_set']
#                     else:
#                         context = {}

#                     return random.choice(intent['responses'])

#     # Check if there is a valid context for the last intent
#     if 'last_intent' in context:
#         last_intent = context['last_intent']
#         if last_intent in data['intents'] and 'last_context' in context and context['last_context'] == last_intent:
#             responses = data['intents'][last_intent]['responses']
#             return random.choice(responses)

#     context = {}
#     return "I'm sorry, I don't understand. Can you please rephrase your statement or question?"

import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

from flask import Flask, render_template, request, jsonify
import nltk
from nltk.stem import LancasterStemmer
import numpy as np
import tensorflow as tf
import tflearn
import random
import json
import pickle
import os

app = Flask(__name__)

stemmer = LancasterStemmer()

with open("intents.json") as file:
    data = json.load(file)

with open("data.pickle", "rb") as f:
    words, labels, training, output = pickle.load(f)

def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1

    return np.array(bag)

net = tflearn.input_data(shape=[None, len(training[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net, tensorboard_dir='tflearn_logs')
model.load("model.tflearn")

# Set debug mode
app.debug = True
app = Flask(__name__, template_folder='HomePage')

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/chatbot', methods=['GET', 'POST'])
def get_bot_response():
    if request.method == 'POST':
        message = request.form['msg']
    else:
        message = request.args.get('msg')
        
    print("Received message:", message)

    if message:
        message = message.lower()
        response = get_response(message)
        return jsonify(response)
    
    return jsonify("Missing Data!")

def get_response(message):
    for intent in data['intents']: 
        if 'patterns' in intent:
            for pattern in intent['patterns']:
                if pattern.lower() in message:
                    return random.choice(intent['responses'])

    return "I'm sorry, I don't understand. Can you please rephrase your statement or question?"

if __name__ == "__main__":
    app.run()
