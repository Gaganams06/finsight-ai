const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchSampleData() {
  const response = await fetch(`${API_BASE_URL}/api/sample`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return await response.json();
}

export async function uploadStatement(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Upload failed with status ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
