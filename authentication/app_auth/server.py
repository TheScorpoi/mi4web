from flask import Flask
from flask import current_app, flash, jsonify, make_response, redirect, request, url_for, render_template
from flask_restful import Resource, Api, reqparse
from cryptography.fernet import Fernet
from bitstring import BitArray
from mysql.connector import Error
from random import randint, random, choice
import pandas as pd
import hashlib
import ast
import mysql.connector
import string

app = Flask(__name__)
api = Api(app)
connection = None
cursor = None

dict_info = {}

@app.route('/')
def home():
    pass

@app.route('/send_hello', methods=['POST'])
def response():
    """Envia a resposta à mensagem da UAP. Verifica se o utilizador existe no servidor. Em caso afirmatico envia o challenge, em caso negativo envia uma mensagem de erro"""
    global connection, cursor, dict_info
    user = request.form.get('username')
    query = "Select email, password from user where email='"+user+"';"
    cursor = connection.cursor()
    cursor.execute(query)
    result = cursor.fetchone()

    server_url = request.url_root[0:-1] + url_for('response_to_chanllenge') #  [0:-1] para retirar a barra (/)
    # server_url é o link para onde a uap terá de enviar os pedidos de  challenge

    if result:
        password = result[1]
        len_password = len(password)
        rnd = randint(0,100)
        last_challenge = rnd
        letters = string.ascii_lowercase
        token_tmp=''
        for i in range(10):
            token_tmp+=choice(letters)
            
        dict_info = {token_tmp : {'user': user, 'last_challenge': rnd, 'password': password, 'len_password': len_password, 'counter': 0, 'valores_errados': False}}
        dict={"challenge":rnd, 'token_tmp' : token_tmp, "challenge_url": server_url}
    else:
        dict={"error":"user not found"}
    return dict
        
@app.route('/calculating_challenge', methods=['POST'])
def response_to_chanllenge():
    """Verifica se o bit recebido corresponde ao que ele pretende, fazendo isto tantas vezes quanto o tamanho da mensagem.
    Caso seja verdadade, calcula uma nova mensagem com a password, o proximo challenge dele, e o bit do resultado do dele.
    Caso seja Falso, ele apenas envia o challenge e um bit aleatório.
    Quando chega ao fim (fez tantas vezes quanto o tamanho da mensagem), envia uma mensagem de sucesso se for o caso, ou de insucesso se não for."""
    global connection, cursor, dict_info
    token_tmp = request.form.get('token_tmp')
    
    password = dict_info[token_tmp]['password']
    len_password = dict_info[token_tmp]['len_password']
    valores_errados = dict_info[token_tmp]['valores_errados']
    counter = dict_info[token_tmp]['counter']
    last_challenge = dict_info[token_tmp]['last_challenge']
    user = dict_info[token_tmp]['user']
    
    counter += 1
    dict_info[token_tmp]['counter'] = counter
    challenge = request.form.get('challenge')
    challenge = int(challenge)
    bit = request.form.get('bit')
    bit = int(bit)
    message = password + str(last_challenge) + str(challenge)
    
    digest = hashlib.sha3_512()
    digest.update(message.encode())
    bits = BitArray(hex=digest.hexdigest())
    bit_to_send = bits.bin[0]
    
    last_challenge = randint(0, 100)
    dict_info[token_tmp]['last_challenge'] = last_challenge
    
    if counter != len_password:
        if bit == int(bit_to_send) and valores_errados == False:
            message = password + str(challenge) + str(last_challenge)
            digest = hashlib.sha3_512()
            digest.update(message.encode())
            bits = BitArray(hex=digest.hexdigest())
            bit_to_send = bits.bin[0]
            dict = {"challenge": last_challenge, "bit": bit_to_send, 'token_tmp': token_tmp}
        else:
            valores_errados = True
            dict_info[token_tmp]['valores_errados'] = valores_errados
            bit_to_send = randint(0, 1)
            dict = {"challenge": last_challenge, "bit": bit_to_send, 'token_tmp': token_tmp}
        return dict        
    else:
        if valores_errados == False:
            letters = string.ascii_lowercase
            token=''
            for i in range(10):
                token+=choice(letters)

            query = "Update user SET token='" + token +"' where email='"+user+"';"
            cursor = connection.cursor()
            cursor.execute(query)
            connection.commit()
            
            # MANDAR URL DO LOGIN DONE
            server_url = request.url_root[0:-1] + url_for('redirectPage') #  [0:-1] para retirar a barra (/)
            dict = {'finnish': True, 'token_tmp': token_tmp, 'done_url': server_url} # finish corresponde ao success
        else:
            server_url = request.url_root[0:-1] + url_for('redirectPage') #  [0:-1] para retirar a barra (/)
            dict = {'finnish': False, 'token_tmp': token_tmp, 'done_url': server_url} # finish corresponde ao success
            dict_info.pop(token_tmp)
        return dict

@app.route('/login_done')
def redirectPage():
    token_tmp = request.args.get('token_tmp')
    user = dict_info[token_tmp]['user']
    dict_info.pop(token_tmp)
    query = "Select token from user where email='"+user+"';"
    cursor = connection.cursor()
    cursor.execute(query)
    result = cursor.fetchone()
    token = result[0]
    return redirect('http://localhost:3000/?token=' + token, code=302)

def connect_db():
    global connection, cursor
    try:
        connection = mysql.connector.connect(host='127.0.0.1',port=3306, database='mi4web', user='root', passwd='password')
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_Info)
            cursor = connection.cursor()
            cursor.execute("select database();")
            record = cursor.fetchone()
            print("You're connected to database: ", record)
            return True
    except Error as e:
        print("Error while connecting to MySQL", e)
        return False

if __name__ == '__main__':
    while not connect_db():
        continue
    
    app.run(host='localhost', port=5001)
    if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")