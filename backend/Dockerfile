FROM python:3.9-slim

WORKDIR /home/app

COPY . .

RUN apt update && apt install build-essential -y
RUN pip install -r requirements.txt

CMD ["bash", "start.sh"]