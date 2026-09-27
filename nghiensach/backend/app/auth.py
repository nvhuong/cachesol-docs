import secrets

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from .config import settings

security = HTTPBasic(auto_error=False)


def credentials_are_valid(username: str, password: str) -> bool:
    valid_user = secrets.compare_digest(username, settings.admin_username)
    valid_password = secrets.compare_digest(password, settings.admin_password)
    return valid_user and valid_password


def admin_auth(request: Request, credentials: HTTPBasicCredentials | None = Depends(security)) -> str:
    session_user = request.session.get("admin_user")
    if session_user and secrets.compare_digest(session_user, settings.admin_username):
        return session_user
    if credentials and credentials_are_valid(credentials.username, credentials.password):
        return credentials.username
    if request.url.path.startswith("/admin"):
        raise HTTPException(status.HTTP_303_SEE_OTHER, headers={"Location": "/admin/login"})
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sai tài khoản", headers={"WWW-Authenticate": "Basic"})
