import pandas as pd
from flask import Flask, render_template, jsonify, request
import os

# Get the absolute path to the project directory
BASE_DIR = r"e:\litbank"

flask_app = Flask(__name__, 
                 static_folder=os.path.join(BASE_DIR, 'static'),
                 template_folder=os.path.join(BASE_DIR, 'templates'))

# Load the dataset
def load_books_data():
    try:
        # Try to load from the data directory
        csv_path = os.path.join(BASE_DIR, 'data', 'books.csv')
        df = pd.read_csv(csv_path)
        print(f"Successfully loaded {len(df)} books from {csv_path}")
        return df
    except Exception as e:
        print(f"Error loading CSV: {e}")

df = load_books_data()

@flask_app.route('/')
def index():
    return render_template('index.html')

@flask_app.route('/api/books')
def get_books():
    try:
        # Get page and limit parameters for pagination
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 12, type=int)
        
        # Calculate start and end indices
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        # Get the slice of books
        books_slice = df.iloc[start_idx:end_idx]
        
        # Convert to list of dictionaries and handle NaN values
        books = books_slice.where(pd.notnull(books_slice), None).to_dict('records')
        
        return jsonify({
            'books': books,
            'total': len(df),
            'page': page,
            'total_pages': (len(df) + limit - 1) // limit
        })
    except Exception as e:
        print(f"Error in /api/books: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@flask_app.route('/api/books/search')
def search_books():
    try:
        query = request.args.get('q', '')
        
        if not query:
            return jsonify({'books': [], 'total': 0})
        
        # Filter books based on search query
        mask = (
            df['title'].astype(str).str.contains(query, case=False, na=False) |
            df['authors'].astype(str).str.contains(query, case=False, na=False) |
            df['categories'].astype(str).str.contains(query, case=False, na=False)
        )
        
        filtered_books = df[mask]
        
        # Handle pagination for search results
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 12, type=int)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        books_slice = filtered_books.iloc[start_idx:end_idx]
        books = books_slice.where(pd.notnull(books_slice), None).to_dict('records')
        
        return jsonify({
            'books': books,
            'total': len(filtered_books),
            'page': page,
            'total_pages': (len(filtered_books) + limit - 1) // limit
        })
    except Exception as e:
        print(f"Error in /api/books/search: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@flask_app.route('/api/books/random')
def random_books():
    # Return 20 random books, replacing NaN with None
    sample = df.sample(n=20)
    books = sample.where(pd.notnull(sample), None).to_dict(orient='records')
    return jsonify({'books': books})

if __name__ == '__main__':
    print("Starting Flask app...")
    print(f"Total books loaded: {len(df)}")
    print(f"Static folder: {flask_app.static_folder}")
    print(f"Template folder: {flask_app.template_folder}")
    flask_app.run(debug=True, port=5000)