"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getReview, submitReview, downloadManuscriptForReview } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Download, ArrowLeft, Send } from "lucide-react";

export default function ReviewSubmissionPage() {
    const router = useRouter();
    const params = useParams();
    const reviewId = Number(params.id);
    const [review, setReview] = useState<any>(null);
    const [formData, setFormData] = useState({
        commentsToAuthor: "",
        commentsToEditor: "",
        recommendation: "ACCEPT",
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadReview();
    }, []);

    const loadReview = async () => {
        try {
            const data = await getReview(reviewId);
            setReview(data);
        } catch (err) {
            setError("Failed to load review");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await submitReview(reviewId, formData);
            router.push("/dashboard/reviewer");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!review) {
        return <div className="p-8">Review not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2" size={16} />
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4">Review Manuscript</h1>
                    <h2 className="text-xl font-semibold mb-2">{review.manuscript?.title}</h2>
                    {review.manuscript?.abstractText && (
                        <p className="text-gray-600 mb-4">{review.manuscript.abstractText}</p>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => downloadManuscriptForReview(reviewId)}
                    >
                        <Download className="mr-2" size={16} />
                        Download Manuscript
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Recommendation <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.recommendation}
                                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            >
                                <option value="ACCEPT">Accept</option>
                                <option value="MINOR_REVISION">Minor Revision</option>
                                <option value="MAJOR_REVISION">Major Revision</option>
                                <option value="REJECT">Reject</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Comments to Author
                            </label>
                            <textarea
                                value={formData.commentsToAuthor}
                                onChange={(e) => setFormData({ ...formData, commentsToAuthor: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={8}
                                placeholder="Provide constructive feedback for the author..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Comments to Editor
                            </label>
                            <textarea
                                value={formData.commentsToEditor}
                                onChange={(e) => setFormData({ ...formData, commentsToEditor: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={6}
                                placeholder="Confidential comments for the editor..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={submitting}>
                                <Send className="mr-2" size={16} />
                                {submitting ? "Submitting..." : "Submit Review"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

