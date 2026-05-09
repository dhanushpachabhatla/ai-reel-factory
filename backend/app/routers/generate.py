from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.schemas import GenerateBatchRequest, GenerateBatchResponse
from app.services.content_engine import generate_batch

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("/batch", response_model=GenerateBatchResponse)
def generate_content_batch(
    request: GenerateBatchRequest,
    settings: Settings = Depends(get_settings),
):
    source, briefs, errors = generate_batch(settings, request.channels, request.reelsPerChannel)
    return GenerateBatchResponse(source=source, briefs=briefs, errors=errors)
