FROM python:3.8

ADD ./app_auth app_auth

COPY ./app_auth/requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

CMD ["python3", "./app_auth/server.py"]