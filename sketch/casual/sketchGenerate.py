from magenta.models.sketch_rnn.rnn import *
from magenta.models.sketch_rnn.utils import *
from magenta.models.sketch_rnn.model import *
from magenta.models.sketch_rnn.sketch_rnn_train import *
from reportlab.graphics import renderPM
from svglib.svglib import svg2rlg
from pathlib import Path
import imageio
import svgwrite  # conda install -c omnia svgwrite=1.1.6
import numpy as np
import os
import json
import tensorflow.compat.v1 as tf
from six.moves import xrange
import shutil

# libraries required for visualisation:
from IPython.display import SVG, display
import PIL
from PIL import Image
import matplotlib.pyplot as plt

from .getFolderName import getFolder

# 控制numpy輸出格式
np.set_printoptions(precision=8, edgeitems=6, linewidth=200, suppress=True)


def setDir(name):
    data_dir = 'model/{}/'.format(name)
    model_dir = 'model/{}/'.format(name)
    dirList = [data_dir, model_dir]
    return dirList


def load_env_compatible(data_dir, model_dir):
    """Loads environment for inference mode, used in jupyter notebook."""
    # modified https://github.com/tensorflow/magenta/blob/master/magenta/models/sketch_rnn/sketch_rnn_train.py
    # to work with depreciated tf.HParams functionality
    model_params = sketch_rnn_model.get_default_hparams()
    with tf.gfile.Open(os.path.join(model_dir, 'model_config.json'), 'r') as f:
        data = json.load(f)
    fix_list = ['conditional', 'is_training', 'use_input_dropout',
                'use_output_dropout', 'use_recurrent_dropout']
    for fix in fix_list:
        data[fix] = (data[fix] == 1)
    model_params.parse_json(json.dumps(data))
    return load_dataset(data_dir, model_params, inference_mode=True)


def getDraw(stroke, name, eval_hps_model):
    z = encode(stroke, eval_hps_model)
    decodeStroke = decode(z, temperature=0.3)
    #np.save('./output/'+name, _)
    return decodeStroke
    # getGIF(name)


def setModel(dirList):
    global sess, eval_model, sample_model
    [train_set, valid_set, test_set, hps_model, eval_hps_model,
        sample_hps_model] = load_env_compatible(dirList[0], dirList[1])
    # construct the sketch-rnn model:
    reset_graph()
    tf.compat.v1.disable_eager_execution()
    model = Model(hps_model)
    tf.compat.v1.disable_eager_execution()
    eval_model = Model(eval_hps_model, reuse=True)
    tf.compat.v1.disable_eager_execution()
    sample_model = Model(sample_hps_model, reuse=True)
    sess = tf.InteractiveSession()
    sess.run(tf.global_variables_initializer())
    # loads the weights from checkpoint into our model
    load_checkpoint(sess, dirList[1])
    return [train_set, valid_set, test_set, hps_model, eval_hps_model, sample_hps_model]


def encode(input_strokes, eval_hps_model):
    strokes = to_big_strokes(
        input_strokes, eval_hps_model.max_seq_len).tolist()
    strokes.insert(0, [0, 0, 1, 0, 0])
    seq_len = [len(input_strokes)]
    return sess.run(eval_model.batch_z, feed_dict={eval_model.input_data: [strokes], eval_model.sequence_lengths: seq_len})[0]


def decode(z_input=None, draw_mode=True, temperature=0.3, factor=0.2, fileName=""):
    z = None
    if z_input is not None:
        z = [z_input]
    sample_strokes, m = sample(
        sess, sample_model, seq_len=eval_model.hps.max_seq_len, temperature=temperature, z=z)
    strokes = to_normal_strokes(sample_strokes)
    return strokes


def drawbyWord(datasetName):
    dataset = getFolder()
    if datasetName in dataset:
        dirList = setDir(datasetName)
        [train_set, valid_set, test_set, hps_model,
            eval_hps_model, sample_hps_model] = setModel(dirList)
        stroke = test_set.random_sample()
        destroke = getDraw(stroke, datasetName, eval_hps_model)
        return destroke

    else:
        print("不存在的dataset！")
        return False


def drawbyStroke(strokeName, datasetName):
    dirList = setDir(datasetName)
    [train_set, valid_set, test_set, hps_model,
     eval_hps_model, sample_hps_model] = setModel(dirList)
    stroke = np.load(strokeName)
    destroke = getDraw(stroke, Path(strokeName).stem, eval_hps_model)
    return destroke
