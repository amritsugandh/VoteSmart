from fastapi import APIRouter
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter(tags=["AI Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    response = await ai_service.generate_response(
        message=req.message,
        state=req.state,
        lang=req.lang
    )
    return ChatResponse(response=response)
