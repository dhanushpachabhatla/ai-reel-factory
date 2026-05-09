from fastapi import APIRouter

from app.seed import CHANNELS

router = APIRouter(prefix="/channels", tags=["channels"])


@router.get("")
def list_channels():
    return {"channels": CHANNELS}
