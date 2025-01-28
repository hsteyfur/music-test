## Music App Project 

## Genre Music Prediction Using Machine Learning

## Team Members: 
- **Nathaly Lamas**
- **Olga Petrova**
- **Feda Zidan**
- **Harrison Teyfur**
- **Ouyang Beiting**
- **Lakshay Garg**

## What does this project do

## Our project uses a machine learning model to predict music genres from listening to provided MP3 snippets of music.

## How it works:
**The music App** is connected to the user's [Spotify](https://open.spotify.com/) account. The MP3 file gets preprocessed using **Librosa library** - the song gets trimmed to 30 seconds and features extracted. The program checks to see if the song's features are the same as trained model features. Then the preprocessed song gets through the saved machine learning model.
The matching genre is then displayed in the App. User can add these songs to their **Spotify** account playlist.

## The choice of machine learning model: 
The machine learning model we used was **CatBoost**.

**CatBoost** (Category Boosting) is a type of machine learning algorithm that uses gradient boosting on decision trees. It’s available as an open source library: [https://catboost.ai/docs/en/](https://catboost.ai/docs/en/)
This model gave us 92% accuracy for predicting genres. We tried to modify the original **Decision trees** model, but **CatBoost** was more effective and yielded the highest accuracy score.

## Different types of machine learning models we tried:
 - Decision Trees - 64% accuracy
 - Recurrent Neural Network - 70% accuracy
 - Multinomial Logistical Regression - 72% accuracy
 - Neural Network - 88% accuracy
 - Random Forest - 88% accuracy
 - XGBoost - 90% accuracy
 - CatBoost - 92% accuracy

## Why it's important
Sometimes we hear a song and want to play similar-sounding songs or find similar-sounding bands. And it helps to see what genre this particular song is because artists vary their genres from album to album. 
Our moods can be different, and we seek particular kinds of music to match our moods. And that's when people can use our app. Modern music apps lack this selection and only show similar artists. We have a choice of a similar genre as the song we'd like to listen to in the current moment.

## Ethical Considerations
We are diligently looking to ensure the music copyrights are not violated.
Additionally we would like to mention this App is used as a student project.
No user data is collected.

## Data we used
**[GTZAN Music Genre Dataset](https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification)**  


## Future improvements
This project was done in 2 weeks and for future improvement, more genres could be added, different moods, similar lyrics, and playlists.
Better accuracy could be achieved. 






