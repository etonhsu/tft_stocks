from google.cloud import secretmanager
import logging

logging.basicConfig(level=logging.DEBUG)


def get_secret(secret_id):
    """Retrieve a secret from Google Secret Manager."""
    project_id = "your-google-cloud-project-id"
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode('UTF-8')