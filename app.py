import os

from flask import Flask
app = Flask(__name__)

url_for('static', filename='style.css')

@app.route('/index.html')
def hello():
    openfile = open('./index.html', 'r')
    file_text = openfile.read()
    return file_text
    
if __name__ == '__main__':
    #Bind to PORT if defined, otherwise default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
