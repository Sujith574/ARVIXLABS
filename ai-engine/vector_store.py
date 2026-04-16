import faiss
import numpy as np
import os
import json
import google.generativeai as genai
from typing import List, Dict, Any

class ArvixVectorStore:
    def __init__(self, index_path: str = "ai_engine_index.faiss", metadata_path: str = "metadata.json"):
        self.index_path = index_path
        self.metadata_path = metadata_path
        self.dimension = 768  # Dimension for gemini-embedding-004
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = []
        
        # Configure Gemini
        genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
        
        self._load()

    def _load(self):
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, 'r') as f:
                self.metadata = json.load(f)

    def _save(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, 'w') as f:
            json.dump(self.metadata, f)

    def get_embedding(self, text: str) -> np.ndarray:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return np.array(result['embedding'], dtype='float32')

    def add_text(self, text: str, metadata: Dict[str, Any]):
        embedding = self.get_embedding(text)
        self.index.add(np.expand_dims(embedding, axis=0))
        self.metadata.append(metadata)
        self._save()

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_embedding = self.get_embedding(query)
        distances, indices = self.index.search(np.expand_dims(query_embedding, axis=0), top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append({
                    "metadata": self.metadata[idx],
                    "distance": float(distances[0][i])
                })
        return results

# Singleton instance
vector_store = ArvixVectorStore()
