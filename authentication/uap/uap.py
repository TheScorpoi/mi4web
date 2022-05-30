from re import S
from flask import Flask, redirect
from flask import current_app, flash, jsonify, make_response, redirect, request, url_for, render_template
from flask_restful import Resource, Api, reqparse
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from random import randint
from bitstring import BitArray
import webbrowser
import hashlib
import pandas as pd
import ast
import os
import requests
import json as JSON
import base64
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def generate_key_uap():
    '''Generates a key to encrypt and decrypt JSON files'''
    if not os.path.isfile('filekey.key'):
        key = Fernet.generate_key()  # chave que vai encriptar a password e o salt
        with open('filekey.key', 'wb') as f:
            f.write(key)
            return key
    else:
        with open('filekey.key', 'rb') as f:
            key = f.read()
            return key


app = Flask(__name__)
api = Api(app)
dict = dict()
valores_errados = False
key = generate_key_uap()
password_key = ""
salt = ""
logged_in = False


server_hello = 'http://localhost:5001/send_hello'
server_challenge = ''
server_done = ''


@app.route('/show_login', methods=['GET'])
def show_login():
    global password_key, salt, page1, logged_in

    if logged_in and os.path.isfile('bd.json') and os.stat('bd.json').st_size != 0:
        # carregar o fichehiro encriptado
        bd_file = open("bd.json", "rb")

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=390000,
        )
        key_bd = base64.urlsafe_b64encode(
            kdf.derive(password_key.encode("utf-8")))

        # desincriptar o ficheiro
        f = Fernet(key_bd)
        content = f.decrypt(bd_file.read())

        bd = JSON.loads(content.decode("utf-8"))
        bd_file.close()

        if page1 in bd.keys():
            return render_template('login.html', page=page1, bd=bd[page1], logged_in=logged_in)
    return render_template('login.html', bd=[], logged_in=logged_in)


@app.route('/confirm_password', methods=['POST', 'GET'])
def confirm_password():
    global password_key, logged_in
    if request.method == 'POST':
        password = request.form['password']

        if len(password) == 0:
            return render_template('confirm_password.html', password="", error="A password não pode estar vazia")

        if password != password_key:
            return render_template('confirm_password.html', password="", error="A password está incorreta")
        else:
            logged_in = True
            return redirect(url_for('show_login'))
    else:
        return render_template('confirm_password.html', password="")


@app.route('/register', methods=['POST', 'GET'])
def register():
    return render_template('register.html', password="")


@app.route('/update_password', methods=['POST', 'GET'])
def update_password():
    global password_key, logged_in, salt, key
    if request.method == 'POST':
        password = request.form['password']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if len(password) == 0:
            return render_template('update_password.html', error="Tem de inserir a password atual")

        if password != password_key:
            return render_template('update_password.html', error="A password está errada")

        if len(new_password) == 0 or len(confirm_password) == 0:
            return render_template('update_password.html', error="Nenhum campo pode estar vazio")

        if new_password != confirm_password:
            return render_template('update_password.html', error="A nova password e a sua confirmação não coincidem")

        # temos de ler o ficheiro da base de dados para depois o encriptar com a nova pass

        if os.path.isfile('bd.json') and os.stat('bd.json').st_size != 0:
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=390000,
            )
            key_bd = base64.urlsafe_b64encode(
                kdf.derive(password_key.encode("utf-8")))

            # carregar o ficheiro encriptado
            bd_file = open("bd.json", "rb")

            # desincriptar o ficheiro
            f = Fernet(key_bd)
            content = f.decrypt(bd_file.read())

            bd = JSON.loads(content.decode("utf-8"))
            bd_file.close()

        # guardar a nova pass
        to_store = JSON.dumps({'password': new_password},
                              indent=4, sort_keys=True).encode('utf-8')

        f = Fernet(key)
        content = f.encrypt(to_store)

        pass_file = open("password.json", "wb")
        pass_file.write(content)
        pass_file.close()

        password_key = new_password
        logged_in = True

        if os.path.isfile('bd.json') and os.stat('bd.json').st_size != 0:
            # guardar a base de dads encriptada com a nova pass
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=390000,
            )
            key_bd = base64.urlsafe_b64encode(
                kdf.derive(new_password.encode("utf-8")))
            bd_file = open("bd.json", "wb")
            f = Fernet(key_bd)
            content = JSON.dumps(bd, indent=4, sort_keys=True).encode('utf-8')
            content = f.encrypt(content)
            bd_file.write(content)
            bd_file.close()

        return redirect(url_for('show_login'))
    else:
        return render_template('update_password.html')


@app.route('/store_password', methods=['POST'])
def store_password():
    global key

    password = request.form['password']

    if len(password) == 0:
        return render_template('create_password.html', password="", error="A password não pode estar vazia")

    # o salt só é calculado uma vez e depois tem de ser sempre o mesmo
    _salt = os.urandom(16)

    to_store = JSON.dumps({'password': password}, indent=4,
                          sort_keys=True).encode('utf-8')

    # encriptar o ficheiro
    f = Fernet(key)
    content = f.encrypt(to_store)

    pass_file = open("password.json", "wb")
    pass_file.write(content)
    pass_file.close()

    salt_file = open("salt.txt", "wb")
    salt_file.write(_salt)
    salt_file.close()

    global password_key, salt, logged_in
    password_key = password
    salt = _salt

    logged_in = True  # acabou de criar a password, fica logado

    return redirect(url_for('show_login'))


@app.route('/', methods=['GET'])
def home():
    global page1, logged_in, server_hello
    page1 = request.args.get('page')
    server_hello = request.args.get('url')
    logged_in = False

    # verificar se o ficheiro existe
    if os.path.isfile('password.json') and os.stat('password.json').st_size != 0:
        # carregar o fichehiro encriptado
        pass_file = open("password.json", "rb")

        # desincriptar o ficheiro
        global key, password_key, salt
        f = Fernet(key)
        content = f.decrypt(pass_file.read())

        x = JSON.loads(content.decode("utf-8"))

        password_key = x["password"]

        pass_file.close()

        salt_file = open("salt.txt", "rb")
        salt = salt_file.read()
        salt_file.close()

        # chamar ficheiro que confirma a password
        return redirect(url_for('confirm_password'))
    else:
        return render_template('create_password.html', password="")

#! mudar o nome da funcao


@app.route('/get_informations', methods=['POST'])
def get_informations():
    """Vai buscar os valores dos campos da pagina de autenticação, e faz os pedidos a API
    Caso o servidor responda negativamente ao 'send_hello()', volta para a página de loggin e diz que o user nao existe.
    Caso o servidor responda afirmativamente, faz o pedido a API para o 'calculating_challenge()', se o que vier for positivo, e os valores_errados = False, temos sucesso na autenticação e redireciona
    para a página main.php.
    Caso o result estaja a True e os valores_errados = True, temos um erro na autenticação e o server é fictício, e redireciona para a página de login.
    Ainda para quando o result = False, signific que a password está incorreta."""
    global dict, valores_errados, page1, password_key, salt, logged_in, server_done
    user = request.form['uid']
    password = request.form['password']
    bd = {}

    # só vai buscar os dados se o user estiver logado
    if logged_in and os.path.isfile('bd.json') and os.stat('bd.json').st_size != 0:
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=390000,
        )
        key_bd = base64.urlsafe_b64encode(
            kdf.derive(password_key.encode("utf-8")))

        # carregar o ficheiro encriptado
        bd_file = open("bd.json", "rb")

        # desincriptar o ficheiro
        f = Fernet(key_bd)
        content = f.decrypt(bd_file.read())

        bd = JSON.loads(content.decode("utf-8"))
        bd_file.close()

    if request.form.get('store_credentials'):

        if logged_in:
            credentials = {"username": str(user), "password": str(password)}

            if page1 not in bd.keys():
                bd[page1] = []

            edit = False
            counter = 0
            for obj in bd[page1]:
                if obj["username"] == user:  # este user name existe na bd
                    edit = True
                    break
                counter += 1

            if edit:
                # aqui temos de atualizar
                bd[page1][counter] = credentials
            else:
                bd[page1].append(credentials)

            bd_file = open("bd.json", "wb")
            content = JSON.dumps(bd, indent=4, sort_keys=True).encode(
                'utf-8')  # para ler temos de fazer decode

            # encriptar o ficheiro
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=390000,
            )
            key_bd = base64.urlsafe_b64encode(
                kdf.derive(password_key.encode("utf-8")))
            f = Fernet(key_bd)
            content = f.encrypt(content)

            bd_file.write(content)
            bd_file.close()

        else:
            return render_template('login.html', page=page1, error="Tem de inserir a password para poder guardar credenciais", logged_in=logged_in)

    password = password.encode("utf-8")

    digest = hashlib.sha3_512()
    digest.update(password)
    dict[user] = digest.hexdigest()
    # mensagem de hello para o servidor
    retorno, challenge, token_tmp = send_hello(user)
    if retorno:
        result, server_token_tmp = calculate_challenge(
            user, challenge, token_tmp)
        if result and valores_errados == False:
            return redirect(server_done+'?token_tmp='+server_token_tmp)
        elif valores_errados == True and result:
            #!voltar para a pagina de login, e dizer que "ahh oh servidor está a dizer que podes entrar, mas é ficticio"
            serverFicticio = True
            valores_errados = False
            # fazer warning a dizer que o user não existe no server
            return render_template('login.html', serverFicticio=serverFicticio, logged_in=logged_in)
        else:
            #!este é para quando a password esta mal
            serverFicticio = False
            incorrectPassword = True
            valores_errados = False
            # fazer warning a dizer que o user não existe no server
            return render_template('login.html', incorrectPassword=incorrectPassword, logged_in=logged_in)
    else:
        userNotFound = True
        # fazer warning a dizer que o user não existe no server
        return render_template('login.html', userNotFound=userNotFound, logged_in=logged_in)

    # if true -> continua a falar c ele e começa a fazer os desafios
    # if false -> retorna-mos ao login e dizeos username invalido

    return make_response(dict[user])


@app.route('/send_hello', methods=['POST'])
def send_hello(user):
    global server_hello, server_challenge
    """Envia uma mensagem para se dar a conhecer ao servidor, enviando-lhe o username de quem se quer autenticar"""
    uap_url = request.url_root[0:-1] + \
        url_for('calculate_challenge')  # [0:-1] para retirar a barra (/)
    # uap_url é o link para onde o servidor terá de responder

    dict_ = {"username": user}
    _request = requests.post(server_hello, data=dict_)
    _request = _request.json()
    if 'error' in _request:
        print(_request['error'])
        challenge = None
        return False, challenge, None
    else:
        challenge = _request['challenge']
        token_tmp = _request['token_tmp']
        server_challenge = _request['challenge_url']
        return True, challenge, token_tmp

#! estamos so a fazer para um user, no entanto, o server pode estar a comunicar com mais que um
#! user ao memso tempo, depois pensar numa maneira de levar o user na mensagem para o server saber
#! com quem esta a falar


@app.route('/calculating_challenge', methods=['POST'])
def calculate_challenge(user, challenge, token_tmp):
    """Verifica se o bit recebido corresponde ao que ele pretende, fazendo isto tantas vezes quanto o tamanho da mensagem.
    Caso seja verdadade, calcula uma nova mensagem com a password, o proximo challenge dele, e o bit do resultado do dele.
    Caso seja Falso, ele apenas envia o challenge e um bit aleatório.
    O UAP apercebe-se que chegou ao fim, quando recebe uma mensagem 'finnish', e acaba de trocar challenges com o servidor"""

    global dict, valores_errados, server_challenge, server_done
    password = dict[user]
    rnd = randint(0, 100)
    message = password + str(challenge) + str(rnd)
    digest = hashlib.sha3_512()
    digest.update(message.encode())
    bits = BitArray(hex=digest.hexdigest())
    bit_to_send = bits.bin[0]
    dict = {"challenge": rnd, "bit": bit_to_send, "token_tmp": token_tmp}

    challenge = rnd

    while True:
        _request = requests.post(server_challenge, data=dict)
        _request = _request.json()

        if 'finnish' in _request:
            server_done = _request['done_url']
            return _request['finnish'], _request['token_tmp']

        recieved_challenge = _request['challenge']
        bit = _request['bit']
        message = password + str(challenge) + str(recieved_challenge)
        digest = hashlib.sha3_512()
        digest.update(message.encode())
        bits = BitArray(hex=digest.hexdigest())
        bit_to_send = bits.bin[0]

        next_challenge = randint(0, 100)
        challenge = next_challenge

        if int(bit) == int(bit_to_send) and valores_errados == False:
            message = password + str(recieved_challenge) + str(next_challenge)
            digest = hashlib.sha3_512()
            digest.update(message.encode())
            bits = BitArray(hex=digest.hexdigest())
            bit_to_send = bits.bin[0]
            dict = {"challenge": next_challenge,
                    "bit": bit_to_send, 'token_tmp': token_tmp}
        else:
            valores_errados = True
            bit_to_send = randint(0, 1)
            dict = {"challenge": next_challenge,
                    "bit": bit_to_send, 'token_tmp': token_tmp}


if __name__ == '__main__':
    app.run(host='localhost', port=9874)
