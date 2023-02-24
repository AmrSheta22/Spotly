from  utils import *
import json
import warnings
import torch
from flask import (
	Flask,
	request,
    jsonify
)
from flask_cors import CORS 

warnings.filterwarnings("ignore")
model, tokenizer = load_model_tokenizer("bert-base-uncased")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
odel = model.to(device)
app = Flask(__name__)
#app.config["DEBUG"] = True
CORS(app)
# make app use less ram
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
# run in development mode
app.config['ENV'] = 'development'
@app.route('/predict', methods=['POST'])
def predict():
    args = request.json
    threshold = args["threshold"] 
    response = []
    last = 0
    for i in args["text"]:
        attention, tokenized_inputs, batch_encoding = text_tokenization(i, model, tokenizer)
        layer_sums = calculate_total_attention(attention)
        del attention
        ids, layer_sums, mask1 = filter_tokens(tokenized_inputs, layer_sums)
        del tokenized_inputs
        ids, layer_sums, mask2 = arbitrary_threshold(layer_sums, ids, threshold)
        del layer_sums
        indices = get_word_indices(mask1, mask2)
        del mask1, mask2
        all_spans = get_corresponding_spans(batch_encoding, indices)
        del batch_encoding, indices
        for j in all_spans:
            response.append([j[0]+last, j[1]+last])
        last += len(i)
        # squeeze the list of lists into a single list    
    print(response)
    print(args["text"])
    # optimize for ram usage by deleting the variables
    # del attention, tokenized_inputs, batch_encoding, layer_sums, ids, mask1, mask2, indices, all_spans
    return jsonify(response)

app.run()
