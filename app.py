from flask import Flask, request, render_template
import pandas as pd

''' load data '''
dataframe = pd.read_csv("data/nature_index_2021_with_coord.csv")

''' main '''

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/show", methods=['POST'])
def display_institution():
    index = request.form['index']
    country_selected = dataframe[:int(index)].to_json(orient='records')
    return country_selected

@app.route("/statistic", methods=['POST'])
def count_institution():
    index = request.form['index']
    country_grouped = dataframe[:int(index)].groupby(["Country"], as_index=False).count()
    country_sorted = country_grouped.sort_values(['rank'],ascending=False).reset_index()
    country_filtered = country_sorted.head().to_json(orient='records')
    return country_filtered

if __name__ == '__main__':
    app.run(host='', port=5000, debug=True)