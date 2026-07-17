from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional

from app.core.config import settings
from app.core.keys import key_manager


def calculate_hash(data: dict) -> str:
    data_string = "|".join(str(v) for v in data.values())
    return hashlib.sha256(data_string.encode()).hexdigest()


def sign_data(data: dict) -> str:
    import hashlib

    data_string = "|".join(str(v) for v in data.values())
    hash_bytes = hashlib.sha256(data_string.encode()).digest()

    signature = key_manager.private_key.sign(hash_bytes, ec.ECDSA(hashes.SHA256()))
    return base64.b64encode(signature).decode()


def verify_signature(data: dict, signature_b64: str) -> bool:
    import hashlib
    import base64

    try:
        data_string = "|".join(str(v) for v in data.values())
        hash_bytes = hashlib.sha256(data_string.encode()).digest()
        signature = base64.b64decode(signature_b64)

        key_manager.public_key.verify(signature, hash_bytes, ec.ECDSA(hashes.SHA256()))
        return True
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


import hashlib
import base64
