const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

function getAuthHeadersFormData(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

// Auth APIs
export async function login(email: string, password: string, role: string = "AUTHOR") {
    const response = await fetch(`${API_BASE_URL}/api/authors/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }

    return response.json();
}

export async function register(data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
}) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    return response.json();
}

export async function requestPasswordReset(email: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/request?email=${encodeURIComponent(email)}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Password reset request failed");
    }

    return response.json();
}

export async function confirmPasswordReset(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/confirm?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Password reset failed");
    }

    return response.json();
}

// Author APIs
export async function submitManuscript(data: {
    title: string;
    abstractText?: string;
    keywords?: string;
    references?: string;
    file: File;
}) {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.abstractText) formData.append("abstractText", data.abstractText);
    if (data.keywords) formData.append("keywords", data.keywords);
    if (data.references) formData.append("references", data.references);
    formData.append("file", data.file);

    const response = await fetch(`${API_BASE_URL}/api/authors/manuscripts`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Submission failed");
    }

    return response.json();
}

export async function getMyManuscripts() {
    const response = await fetch(`${API_BASE_URL}/api/authors/manuscripts`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch manuscripts");
    }

    return response.json();
}

export async function getManuscript(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/authors/manuscripts/${id}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch manuscript");
    }

    return response.json();
}

export async function updateManuscript(id: number, data: {
    title?: string;
    abstractText?: string;
    keywords?: string;
    references?: string;
    file?: File;
}) {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.abstractText) formData.append("abstractText", data.abstractText);
    if (data.keywords) formData.append("keywords", data.keywords);
    if (data.references) formData.append("references", data.references);
    if (data.file) formData.append("file", data.file);

    const response = await fetch(`${API_BASE_URL}/api/authors/manuscripts/${id}`, {
        method: "PUT",
        headers: getAuthHeadersFormData(),
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Update failed");
    }

    return response.json();
}

export async function searchManuscripts(query?: string) {
    const url = new URL(`${API_BASE_URL}/api/authors/manuscripts/search`);
    if (query) url.searchParams.append("query", query);

    const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Search failed");
    }

    return response.json();
}

export async function getSubmissionDeadline() {
    const response = await fetch(`${API_BASE_URL}/api/authors/deadline`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export async function downloadManuscript(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/authors/manuscripts/${id}/download`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manuscript-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export async function updateAuthorProfile(fullName: string) {
    const response = await fetch(`${API_BASE_URL}/api/authors/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ fullName }),
    });

    if (!response.ok) {
        throw new Error("Profile update failed");
    }

    return response.json();
}

// Reviewer APIs
export async function getMyAssignments() {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/assignments`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch assignments");
    }

    return response.json();
}

export async function getReview(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/assignments/${id}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch review");
    }

    return response.json();
}

export async function updateReviewStatus(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/assignments/${id}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Status update failed");
    }

    return response.json();
}

export async function submitReview(id: number, data: {
    commentsToAuthor: string;
    commentsToEditor: string;
    recommendation: string;
}) {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/assignments/${id}/submit`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Review submission failed");
    }

    return response.json();
}

export async function getReviewHistory() {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/history`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch review history");
    }

    return response.json();
}

export async function downloadManuscriptForReview(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/assignments/${id}/download`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manuscript-review-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export async function updateReviewerProfile(fullName: string) {
    const response = await fetch(`${API_BASE_URL}/api/reviewers/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ fullName }),
    });

    if (!response.ok) {
        throw new Error("Profile update failed");
    }

    return response.json();
}

// Editor APIs
export async function getNewSubmissions() {
    const response = await fetch(`${API_BASE_URL}/api/editors/submissions`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch submissions");
    }

    return response.json();
}

export async function getAllManuscripts() {
    const response = await fetch(`${API_BASE_URL}/api/editors/manuscripts`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch manuscripts");
    }

    return response.json();
}

export async function getManuscriptForEditor(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/editors/manuscripts/${id}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch manuscript");
    }

    return response.json();
}

export async function assignReviewer(manuscriptId: number, reviewerId: number, deadline: string) {
    const response = await fetch(`${API_BASE_URL}/api/editors/manuscripts/${manuscriptId}/assign-reviewer`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reviewerId, deadline }),
    });

    if (!response.ok) {
        throw new Error("Assignment failed");
    }

    return response.json();
}

export async function makeDecision(manuscriptId: number, decision: string, comments?: string) {
    const response = await fetch(`${API_BASE_URL}/api/editors/manuscripts/${manuscriptId}/decision`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ decision, comments }),
    });

    if (!response.ok) {
        throw new Error("Decision failed");
    }

    return response.json();
}

export async function createJournal(name: string, description?: string) {
    const response = await fetch(`${API_BASE_URL}/api/editors/journals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
        throw new Error("Journal creation failed");
    }

    return response.json();
}

export async function getAllJournals() {
    const response = await fetch(`${API_BASE_URL}/api/editors/journals`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch journals");
    }

    return response.json();
}

export async function createIssue(data: {
    journalId: number;
    volume: string;
    number: string;
    publicationDate: string;
}) {
    const response = await fetch(`${API_BASE_URL}/api/editors/issues`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Issue creation failed");
    }

    return response.json();
}

export async function publishManuscript(manuscriptId: number, issueId?: number, googleScholarUrl?: string) {
    const response = await fetch(`${API_BASE_URL}/api/editors/manuscripts/${manuscriptId}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ issueId, googleScholarUrl }),
    });

    if (!response.ok) {
        throw new Error("Publishing failed");
    }

    return response.json();
}

export async function updateEditorProfile(fullName: string) {
    const response = await fetch(`${API_BASE_URL}/api/editors/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ fullName }),
    });

    if (!response.ok) {
        throw new Error("Profile update failed");
    }

    return response.json();
}

// Public APIs
export async function searchArticles(query?: string, keyword?: string) {
    const url = new URL(`${API_BASE_URL}/api/public/articles`);
    if (query) url.searchParams.append("query", query);
    if (keyword) url.searchParams.append("keyword", keyword);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error("Search failed");
    }

    return response.json();
}

export async function getArticle(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/public/articles/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch article");
    }

    return response.json();
}

export async function downloadArticle(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/public/articles/${id}/download`);

    if (!response.ok) {
        throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `article-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
