import boto3
from botocore.exceptions import ClientError


def check_s3_file_exists(file_name):
    s3 = boto3.client('s3')
    bucket_name = 'jobbee-samlee'

    try:
        s3.head_object(Bucket=bucket_name, Key=file_name)
        return True
    except ClientError:
        return False
