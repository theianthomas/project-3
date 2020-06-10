
#!/usr/bin/env python

import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask import Flask, request, render_template, redirect
import pymongo
from bson.json_util import dumps
import copy
import requests 


# Use PyMongo to establish Mongo connection

app = Flask(__name__)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.emission
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api")
def data():
    x = db.co2.find()
    print(x)
    x_json = dumps(x)
    return x_json
if __name__ == "__main__":
    app.run(debug=True)
