FROM python:latest
WORKDIR /
COPY ./crawler-pix.py ./api-cost-explorer.py .
RUN pip install --no-cache-dir mysql-connector-python boto3 requests

CMD ["python", "crawler-pix.py"]