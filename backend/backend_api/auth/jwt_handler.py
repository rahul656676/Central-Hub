from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

router = APIRouter()
security = HTTPBearer()
SECRET_KEY = "super_secret_central_key_for_demo_purposes_only"

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        # Example token decode, expecting {"site_scope": "LUGOBA"} or {"site_scope": "ALL"}
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/me")
def get_current_user(token_payload: dict = Depends(verify_token)):
    return {"status": "authenticated", "scope": token_payload.get("site_scope")}
