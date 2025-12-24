"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitManuscript } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Upload, ArrowLeft } from "lucide-react";

export default function SubmitManuscriptPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        abstractText: "",
        keywords: "",
        references: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!file) {
            setError("Please select a file");
            return;
        }

        if (!formData.title) {
            setError("Title is required");
            return;
        }

        setLoading(true);

        try {
            await submitManuscript({
                ...formData,
                file,
            });
            router.push("/dashboard/author");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2" size={16} />
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">Submit Manuscript</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Abstract</label>
                            <textarea
                                value={formData.abstractText}
                                onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={5}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Keywords</label>
                            <input
                                type="text"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Comma-separated keywords"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">References</label>
                            <textarea
                                value={formData.references}
                                onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={5}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Manuscript File (PDF or DOCX) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                <Upload className="mr-2" size={16} />
                                {loading ? "Submitting..." : "Submit Manuscript"}
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

