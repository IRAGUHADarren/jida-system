"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    getMyManuscripts, 
    getSubmissionDeadline, 
    searchManuscripts,
    downloadManuscript 
} from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FileText, Search, Upload, Calendar, Download } from "lucide-react";

interface Manuscript {
    id: number;
    title: string;
    abstractText?: string;
    keywords?: string;
    status: string;
    submittedAt: string;
    publishedAt?: string;
}

export default function AuthorDashboard() {
    const router = useRouter();
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deadline, setDeadline] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        loadData();
    }, [router]);

    const loadData = async () => {
        try {
            const [manuscriptsData, deadlineData] = await Promise.all([
                getMyManuscripts(),
                getSubmissionDeadline()
            ]);
            setManuscripts(manuscriptsData);
            setDeadline(deadlineData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            const results = await searchManuscripts(searchQuery);
            setManuscripts(results);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        router.push("/");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACCEPTED": return "text-green-600";
            case "REJECTED": return "text-red-600";
            case "UNDER_REVIEW": return "text-blue-600";
            case "REVISION_REQUIRED": return "text-yellow-600";
            default: return "text-gray-600";
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Author Dashboard</h1>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push("/dashboard/author/submit")}>
                            <Upload className="mr-2" size={16} />
                            Submit Manuscript
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                {deadline && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-blue-600" size={20} />
                            <div>
                                <p className="font-semibold text-blue-900">Submission Deadline</p>
                                <p className="text-blue-700">
                                    {new Date(deadline.deadline).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Search manuscripts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 border rounded-lg"
                            />
                            <Button onClick={handleSearch}>
                                <Search size={16} />
                            </Button>
                        </div>
                        <Button variant="outline" onClick={loadData}>
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">My Manuscripts</h2>
                    {manuscripts.length === 0 ? (
                        <p className="text-gray-500">No manuscripts found. Submit your first manuscript to get started.</p>
                    ) : (
                        <div className="space-y-4">
                            {manuscripts.map((manuscript) => (
                                <div
                                    key={manuscript.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                {manuscript.title}
                                            </h3>
                                            {manuscript.abstractText && (
                                                <p className="text-gray-600 mb-2 line-clamp-2">
                                                    {manuscript.abstractText}
                                                </p>
                                            )}
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>
                                                    Submitted: {new Date(manuscript.submittedAt).toLocaleDateString()}
                                                </span>
                                                <span className={getStatusColor(manuscript.status)}>
                                                    Status: {manuscript.status.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadManuscript(manuscript.id)}
                                            >
                                                <Download size={16} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/dashboard/author/manuscripts/${manuscript.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

