FROM python:3.8

ADD ./uap uap

COPY ./uap/requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

CMD ["python3", "./uap/uap.py"]