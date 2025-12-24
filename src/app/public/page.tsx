"use client";
import { useEffect, useState } from "react";
import { searchArticles, downloadArticle } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Search, Download, FileText } from "lucide-react";

interface Article {
    id: number;
    title: string;
    abstractText?: string;
    keywords?: string;
    publishedAt?: string;
    author: {
        fullName: string;
    };
}

export default function PublicArchive() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const data = await searchArticles();
            setArticles(data);
        } catch (error) {
            console.error("Failed to load articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const results = await searchArticles(searchQuery, keyword);
            setArticles(results);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Journal of Inter Discourse Academia</h1>
                    <p className="text-gray-600">Browse and search published articles</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Search by Title/Abstract</label>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Search by Keyword</label>
                            <input
                                type="text"
                                placeholder="Enter keywords..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSearch} className="w-full">
                        <Search className="mr-2" size={16} />
                        Search
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Published Articles</h2>
                    {articles.length === 0 ? (
                        <p className="text-gray-500">No articles found.</p>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                {article.title}
                                            </h3>
                                            {article.abstractText && (
                                                <p className="text-gray-600 mb-2 line-clamp-3">
                                                    {article.abstractText}
                                                </p>
                                            )}
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>Author: {article.author.fullName}</span>
                                                {article.publishedAt && (
                                                    <span>
                                                        Published: {new Date(article.publishedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {article.keywords && (
                                                    <span>Keywords: {article.keywords}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadArticle(article.id)}
                                            >
                                                <Download size={16} />
                                                Download
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/public/articles/${article.id}`}
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

