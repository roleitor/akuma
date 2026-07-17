from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.backends import default_backend
import hashlib
import json
import os

from app.core.config import settings


class KeyManager:
    def __init__(self):
        self._private_key = None
        self._public_key = None

    def load_keys(self):
        if os.path.exists(settings.PRIVATE_KEY_PATH):
            with open(settings.PRIVATE_KEY_PATH, "rb") as f:
                self._private_key = serialization.load_pem_private_key(
                    f.read(), password=None, backend=default_backend()
                )
        if os.path.exists(settings.PUBLIC_KEY_PATH):
            with open(settings.PUBLIC_KEY_PATH, "rb") as f:
                self._public_key = serialization.load_pem_public_key(
                    f.read(), backend=default_backend()
                )

    def generate_keys(self):
        self._private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
        self._public_key = self._private_key.public_key()

        os.makedirs(os.path.dirname(settings.PRIVATE_KEY_PATH), exist_ok=True)

        with open(settings.PRIVATE_KEY_PATH, "wb") as f:
            f.write(
                self._private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption(),
                )
            )

        with open(settings.PUBLIC_KEY_PATH, "wb") as f:
            f.write(
                self._public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo,
                )
            )

    @property
    def private_key(self):
        if self._private_key is None:
            self.load_keys()
        return self._private_key

    @property
    def public_key(self):
        if self._public_key is None:
            self.load_keys()
        return self._public_key

    def get_public_key_hex(self) -> str:
        public_bytes = self.public_key.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint,
        )
        return public_bytes.hex()


key_manager = KeyManager()
