import re
from typing import Optional

from pydantic import BaseModel, field_validator


class SurveySubmission(BaseModel):
    albumNumber: str
    fullName: str
    selectedDates: list[str]
    transport: str
    seats: Optional[int] = None

    @field_validator("albumNumber")
    @classmethod
    def album_must_be_digits(cls, v):
        if not re.match(r"^\d{4}$", v):
            raise ValueError("Musi mieć 4 cyfry")
        return v
