const API_URL = "/api";

export const fetchQuestions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/questions?${query}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};

export async function createQuestion(data) {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create question');
    }

    return response.json();
  } catch (error) {
    console.error("API Error in createQuestion:", error);
    throw error;
  }
}

export async function updateQuestion(id, data) {
  const res = await fetch(`${API_URL}/questions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update question");
  return res.json();
}

export async function clearBoard() {
  const res = await fetch(`${API_URL}/questions`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete questions");
  return res.json();
}
