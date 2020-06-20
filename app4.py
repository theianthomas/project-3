
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
db3=client.vaemission
@app.route("/")
def index():
    return render_template("index1.html")




@app.route("/index3.html")
def index3():
    return render_template("index3.html")


@app.route("/api")
def data():
    x = db.co2.find()
    print(x)
    x_json = dumps(x)
    return x_json

@app.route("/api3")
def data3():
    x3 = db3.vaco2.find()
    print(x3)
    x3_json = dumps(x3)
    return x3_json


@app.route("/api4")
def data4():
    x4 = db3.vaco3.find()
    print(x4)
    x4_json = dumps(x4)
    return x4_json
if __name__ == "__main__":
    app.run(debug=True)