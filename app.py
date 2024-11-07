from flask import Flask, render_template, request, redirect, url_for
import requests
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/results', methods=['POST'])
def results():
    # Get the university name from the form
    university_name = request.form['university_name']
    institution_id = request.form.get('institution_id')
    print(f'institution_id:{institution_id}')
    
    # Get publications count over time
    publications_url = f'https://api.openalex.org/works?filter=institutions.id:{institution_id}&group_by=publication_year'
    publications_data = requests.get(publications_url).json()
    publications_data = pd.DataFrame(publications_data['group_by']).astype({'key':int}).sort_values(by='key')

    # Create a plot
    fig, ax = plt.subplots()
    ax.plot(publications_data['key'], publications_data['count'], marker='o')
    ax.set_title(f'Publications Over Time for {university_name}')
    ax.set_xlabel('Year')
    ax.set_ylabel('Number of Publications')
    ax.set_xlim(2000, 2023)

    # Save plot to a string buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode('utf8')
    buffer.close()

    return render_template('results.html', plot_data=plot_data, university_name=university_name)

if __name__ == '__main__':
    app.run(debug=True) 