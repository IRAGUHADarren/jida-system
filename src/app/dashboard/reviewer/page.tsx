"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    getMyAssignments, 
    updateReviewStatus,
    downloadManuscriptForReview 
} from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Clock, CheckCircle } from "lucide-react";

interface Review {
    id: number;
    status: string;
    deadline: string;
    manuscript: {
        id: number;
        title: string;
        abstractText?: string;
    };
}

export default function ReviewerDashboard() {
    const router = useRouter();
    const [assignments, setAssignments] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        loadAssignments();
    }, [router]);

    const loadAssignments = async () => {
        try {
            const data = await getMyAssignments();
            setAssignments(data);
        } catch (error) {
            console.error("Failed to load assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reviewId: number, status: string) => {
        try {
            await updateReviewStatus(reviewId, status);
            await loadAssignments();
        } catch (error) {
            console.error("Status update failed:", error);
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
            case "FINISHED_REVIEW": return "text-green-600";
            case "IN_PROGRESS": return "text-blue-600";
            case "BEGIN_REVIEW": return "text-yellow-600";
            default: return "text-gray-600";
        }
    };

    const isDeadlineApproaching = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const daysUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntilDeadline <= 3 && daysUntilDeadline > 0;
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Reviewer Dashboard</h1>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.push("/dashboard/reviewer/history")}>
                            Review History
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">My Review Assignments</h2>
                    {assignments.length === 0 ? (
                        <p className="text-gray-500">No review assignments at this time.</p>
                    ) : (
                        <div className="space-y-4">
                            {assignments.map((review) => (
                                <div
                                    key={review.id}
                                    className={`border rounded-lg p-4 ${
                                        isDeadlineApproaching(review.deadline) 
                                            ? "border-yellow-400 bg-yellow-50" 
                                            : ""
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                {review.manuscript.title}
                                            </h3>
                                            {review.manuscript.abstractText && (
                                                <p className="text-gray-600 mb-2 line-clamp-2">
                                                    {review.manuscript.abstractText}
                                                </p>
                                            )}
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span className={getStatusColor(review.status)}>
                                                    Status: {review.status.replace("_", " ")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    Deadline: {new Date(review.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadManuscriptForReview(review.id)}
                                            >
                                                <Download size={16} />
                                                Download
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => router.push(`/dashboard/reviewer/review/${review.id}`)}
                                            >
                                                Review
                                            </Button>
                                        </div>
                                    </div>
                                    {review.status !== "FINISHED_REVIEW" && (
                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(review.id, "BEGIN_REVIEW")}
                                            >
                                                Begin Review
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(review.id, "IN_PROGRESS")}
                                            >
                                                Mark In Progress
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

