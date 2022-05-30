#! /opt/homebrew/bin/python3.9

import mysql.connector
from mysql.connector import Error
import requests
import time
import datetime
from datetime import datetime, timedelta

class ChartInformation:
    
    def __init__(self) -> None:
        self.connection = mysql.connector.connect(host='localhost', port=3306, database='mi4web', user='root', password='YES')
        self.cursor = None
        self.URL = "http://mednat.ieeta.pt:8765/"
        
    def connectionDB (self):
        try:
            if self.connection.is_connected():
                db_info = self.connection.get_server_info()
                self.cursor = self.connection.cursor()
                self.cursor.execute("select database();")
                record = self.cursor.fetchone()
                print("Connected to MySQL Server version ", db_info)
        except Error as e:
            print("Error while connecting to MySQL", e)
    
    def make_request_to_server(self) -> int:
        try:
            req = requests.get(self.URL + "statistics")
            if req.status_code == 200:    
                studies = req.json().get('CountStudies')
                return studies
            return 0
        except:
            print("Error while making request to server")
            return 0
    
    def store_on_db(self, count_studies: int, day: str):
        try:
            self.cursor.execute("INSERT INTO chart_info (day_, count_studies) VALUES (%s, %s)", (day, count_studies))
            self.connection.commit()
            print(self.cursor.rowcount, "record inserted on chart_info.")
        except Error as e:
            print("Error while storing on DB", e)
    
if __name__ == "__main__":
    chart_info = ChartInformation()
    chart_info.connectionDB()
    study = chart_info.make_request_to_server()
    chart_info.store_on_db(study, datetime.now().strftime("%Y-%m-%d"))