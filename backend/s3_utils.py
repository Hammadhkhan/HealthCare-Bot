import boto3
import os
from botocore.exceptions import NoCredentialsError

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET = os.getenv("S3_BUCKET")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

def upload_file_to_s3(file_path: str, key: str):
    try:
        s3.upload_file(file_path, S3_BUCKET, key)
        return True
    except NoCredentialsError:
        print("AWS credentials not found")
        return False

def generate_presigned_url(key: str, expires_in: int = 3600):
    try:
        return s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": key},
            ExpiresIn=expires_in,
        )
    except Exception as e:
        print("Error generating presigned URL:", e)
        return None
