"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    getNewSubmissions, 
    getAllManuscripts,
    makeDecision 
} from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FileText, CheckCircle, XCircle, Edit } from "lucide-react";

interface Manuscript {
    id: number;
    title: string;
    abstractText?: string;
    status: string;
    submittedAt: string;
    author: {
        fullName: string;
        email: string;
    };
}

export default function EditorDashboard() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Manuscript[]>([]);
    const [allManuscripts, setAllManuscripts] = useState<Manuscript[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"new" | "all">("new");

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
            const [newSubmissions, all] = await Promise.all([
                getNewSubmissions(),
                getAllManuscripts()
            ]);
            setSubmissions(newSubmissions);
            setAllManuscripts(all);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (manuscriptId: number, decision: string) => {
        try {
            await makeDecision(manuscriptId, decision);
            await loadData();
        } catch (error) {
            console.error("Decision failed:", error);
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

    const manuscriptsToShow = activeTab === "new" ? submissions : allManuscripts;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Editor Dashboard</h1>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push("/dashboard/editor/publish")}>
                            Publish Articles
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b">
                        <button
                            className={`px-6 py-3 font-semibold ${
                                activeTab === "new"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("new")}
                        >
                            New Submissions ({submissions.length})
                        </button>
                        <button
                            className={`px-6 py-3 font-semibold ${
                                activeTab === "all"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Manuscripts ({allManuscripts.length})
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {manuscriptsToShow.length === 0 ? (
                        <p className="text-gray-500">No manuscripts found.</p>
                    ) : (
                        <div className="space-y-4">
                            {manuscriptsToShow.map((manuscript) => (
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
                                                <span>Author: {manuscript.author.fullName}</span>
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
                                                onClick={() => router.push(`/dashboard/editor/manuscripts/${manuscript.id}`)}
                                            >
                                                <Edit size={16} />
                                                Manage
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

