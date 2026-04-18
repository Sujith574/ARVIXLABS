import faiss
import numpy as np
import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from app.core.config import settings

class VectorService:
    def __init__(self):
        self.dimension = 768  # arvix-embedding-004
        self.index_path = "vector_index.faiss"
        self.metadata_path = "vector_metadata.json"
        
        # Ensure directory exists for index files
        self.data_dir = os.path.join(os.path.dirname(__file__), "../../../cms_data")
        os.makedirs(self.data_dir, exist_ok=True)
        
        self.full_index_path = os.path.join(self.data_dir, self.index_path)
        self.full_metadata_path = os.path.join(self.data_dir, self.metadata_path)
        
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = []
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self._load()

    def _load(self):
        if os.path.exists(self.full_index_path):
            try:
                self.index = faiss.read_index(self.full_index_path)
            except: pass
        if os.path.exists(self.full_metadata_path):
            try:
                with open(self.full_metadata_path, 'r') as f:
                    self.metadata = json.load(f)
            except: pass

    def _save(self):
        faiss.write_index(self.index, self.full_index_path)
        with open(self.full_metadata_path, 'w') as f:
            json.dump(self.metadata, f)

    def get_embedding(self, text: str) -> np.ndarray:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return np.array(result['embedding'], dtype='float32')

    async def add_context(self, text: str, meta: Dict[str, Any]):
        embedding = self.get_embedding(text)
        self.index.add(np.expand_dims(embedding, axis=0))
        self.metadata.append({"text": text, **meta})
        self._save()

    async def search(self, query: str, top_k: int = 3) -> List[str]:
        if self.index.ntotal == 0:
            return []
            
        query_emb = self.get_embedding(query)
        distances, indices = self.index.search(np.expand_dims(query_emb, axis=0), top_k)
        
        results = []
        for idx in indices[0]:
            if idx != -1 and idx < len(self.metadata):
                results.append(self.metadata[idx]["text"])
        return results

vector_service = VectorService()
