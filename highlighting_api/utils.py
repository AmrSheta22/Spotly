from transformers import AutoTokenizer, AutoModel, utils
import numpy as np
from transformers import logging
logging.set_verbosity_error()
def load_model_tokenizer(model_path):
    model = AutoModel.from_pretrained(model_path, output_attentions=True)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    return model, tokenizer

def text_tokenization(input_text, model, tokenizer):
    batch_encoding = tokenizer.encode_plus(input_text, return_tensors='pt')
    tokenized_inputs = batch_encoding["input_ids"]
    outputs = model(tokenized_inputs)  # Run model
    attention = outputs[-1]  # Retrieve attention from model outputs
    return attention, tokenized_inputs, batch_encoding

def calculate_total_attention(attention):
    layer_sums = np.zeros((1, attention[0][0][0].shape[0]))
    for layer in attention:
        head_sums = np.zeros((1, layer[0][0].shape[1]))
        for head in layer[0]:
            head = head.detach().numpy()
            head_sums +=np.sum(head, axis = 0)
        layer_sums += head_sums
    return layer_sums[0]

def filter_tokens(inputs, layer_sums):
    ids = inputs[0].detach().numpy()
    out = [101, 102, 1010, 1011, 1012, 100, 1005, 1025, 1026, 1027, 1006, 1007, 1031, 1032,1000]
    mask1 = np.ones(ids.shape, dtype = bool)
    for i in range(len(mask1)):
        if ids[i] in out:
            mask1[i] = 0
    ids = ids[mask1]
    layer_sums = layer_sums[mask1]
    return ids, layer_sums, mask1

def arbitrary_threshold(layer_sums, ids, threshold = 70):
    # get 90 percentile of layer sums
    if layer_sums.size > 0:
        threshold = np.percentile(layer_sums, threshold)
    mask2 = np.zeros(layer_sums.shape, dtype = bool)
    for i, k in enumerate(layer_sums):
        if k > threshold:
            mask2[i] = 1
    ids = ids[mask2]
    layer_sums = layer_sums[mask2]
    return ids, layer_sums, mask2

def get_word_indices(mask1, mask2):
    indices = np.arange(0,len(mask1))
    indices= indices[mask1]
    indices= indices[mask2]
    return indices

def get_corresponding_spans(batch_encoding, indices):
    all_spans = []
    for i in indices:
        lis = [batch_encoding.token_to_chars(i)[0], batch_encoding.token_to_chars(i)[1]]
        all_spans.append(lis)
    return all_spans

def spans_to_words(all_spans, input_text):
    words = []
    for i in all_spans:
        words.append(input_text[i[0]:i[1]])
    return words