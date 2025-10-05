# litbank.

## introduction

litbank. is a powerful content-based book reccommendation engine

It uses large language models (like chatgpt) to understand book descriptions, providing deep, semantic recommendations.

Load it up and find a book you won't want to put down.

## features.

- **Semantic Search:** Finds books based on meaning, not just keywords or genre matching.
- **Live Filtering:** Instantly filter the database as you type.
- **Modern UI:** Clean, responsive interface built with flask.
- **Scalable Backend:** Efficient vector search using FAISS, won't slow down on a larger database.

## tech stack.

- **Python 3.8+**
- **Flask** (web framework)
- **pandas** (data manipulation)
- **FAISS** (vector similarity search)
- **Ollama** (local LLM embeddings)
- **HTML/CSS/JavaScript** (frontend)

## usage.

// to be added

## interface
![screenshot of ui](/static/images/interface-first-draft.png)

## Development Log

> **01/10/2025**  
> Created the first working draft of the index, trained on the 'embeddinggemma' model.
> Initialised a repository and uploaded relevant files.

> **05/10/2025**  
> Created the first draft of the UI using Flask.  
> Currently displays the entire database on the home screen.  
> Search functionality filters by name.
>
> *ML Implementation to be added to web app*
> *Table CSS to be added*

## Future Improvements
- Add user authentication and profiles
- Improve recommendation algorithm
- Deploy to cloud for public access

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)