FROM python:3.7-alpine 
WORKDIR /uap 
RUN apk update
RUN apk add make automake gcc g++ subversion python3-dev
RUN python3 -m pip install --upgrade pip
COPY requirements.txt /uap
RUN pip3 install -r requirements.txt 
COPY . /uap 
ENTRYPOINT ["python3"] 
CMD ["python3","uap.py"]