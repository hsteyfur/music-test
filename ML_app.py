#!/usr/bin/env python
# coding: utf-8

import pickle
from catboost import CatBoostClassifier
import pandas as pd
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import requests

import warnings
warnings.filterwarnings('ignore')


model = CatBoostClassifier()
model.load_model('model/catboost_model_with_label_encoding.cb')

with open('model/label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)


user_input = input("Please enter the link: ")
url = user_input
response = requests.get(url)
with open('audio.mp3', 'wb') as file:
    file.write(response.content)
audio_path = "audio.mp3"


path = audio_path
data=[]
try:
    y, sr = librosa.load(path, mono=True)
    segment_duration = 3 
    samples_per_segment = segment_duration * sr
    num_segments = len(y) // samples_per_segment 

    for i in range(num_segments):
        start = i * samples_per_segment
        end = start + samples_per_segment
        segment = y[start:end]

        if len(segment) < samples_per_segment:
            continue

        chroma_stft = librosa.feature.chroma_stft(y=segment, sr=sr)
        rms = librosa.feature.rms(y=segment)
        spec_cent = librosa.feature.spectral_centroid(y=segment, sr=sr)
        spec_bw = librosa.feature.spectral_bandwidth(y=segment, sr=sr)
        spec_flat = librosa.feature.spectral_flatness(y=segment)
        rolloff = librosa.feature.spectral_rolloff(y=segment, sr=sr)
        zcr = librosa.feature.zero_crossing_rate(segment)
        harmony, perceptr = librosa.effects.harmonic(segment), librosa.effects.percussive(segment)
        tempo, _ = librosa.beat.beat_track(y=segment, sr=sr)
        mfcc = librosa.feature.mfcc(y=segment, sr=sr, n_mfcc=20)
        tonnetz = librosa.feature.tonnetz(y=segment, sr=sr)
        cens = librosa.feature.chroma_cens(y=segment, sr=sr)

        features = [
            f"{path}", len(segment),
            np.mean(chroma_stft), np.var(chroma_stft),
            np.mean(rms), np.var(rms),
            np.mean(spec_cent), np.var(spec_cent),
            np.mean(spec_bw), np.var(spec_bw),
            np.mean(spec_flat), np.var(spec_flat),
            np.mean(rolloff), np.var(rolloff),
            np.mean(zcr), np.var(zcr),
            np.mean(harmony), np.var(harmony),
            np.mean(perceptr), np.var(perceptr),
            np.mean(tonnetz), np.var(tonnetz),
            np.mean(cens), np.var(cens),
            float(tempo)
        ]

        for coeff in mfcc:
            features.append(np.mean(coeff))
            features.append(np.var(coeff))

        data.append(features)

except Exception as e:
    print(f"Error processing {path}: {e}")

columns=['filename', 'length',
         'chroma_stft_mean', 'chroma_stft_var',
         'rms_mean', 'rms_var',
         'spectral_centroid_mean', 'spectral_centroid_var',
         'spectral_bandwidth_mean', 'spectral_bandwidth_var',
         'spectral_flatness_mean', 'spectral_flatness_var',
         'rolloff_mean', 'rolloff_var',
         'zero_crossing_rate_mean','zero_crossing_rate_var',
         'harmony_mean', 'harmony_var',
         'perceptr_mean', 'perceptr_var',
         'tonnetz_mean', 'tonnetz_var',
         'chroma_cens_mean', 'chroma_cens_var',
         'tempo'] + \
         [f'mfcc{i+1}_{stat}' for i in range(20) for stat in ['mean', 'var']]
         
df = pd.DataFrame(data, columns=columns)

df_test = df.drop(columns=['filename','length'])
predictions = model.predict(df_test)
predictions = label_encoder.inverse_transform(predictions)
df['label'] = predictions
df[['filename','label']]

print(path)
print(df['label'].value_counts().index.to_list())







