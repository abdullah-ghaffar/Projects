from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Article:
    id: int
    title: str
    content: str
    publish_date: datetime

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            id=data['id'],
            title=data['title'],
            content=data['content'],
            publish_date=datetime.fromisoformat(data['publish_date'])
        )
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "publish_date": self.publish_date.isoformat()
        }