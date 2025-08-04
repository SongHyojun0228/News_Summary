"use client";

import { Suspense, useState } from "react";

export default function HomePage() {
    const [url, setUrl] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState("");
    const [head, setHead] = useState("");

    const handleSubmit = async () => {
        if (!url) alert("URL을 입력해주세요");

        setLoading(true);
        setContent("");
        setHead("");

        try {
            const res = await fetch(`/api/crawling?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.error) {
                alert("크롤링 실패: " + data.error);
            } else {
                setContent(data.content);
                setHead(data.head); 
            }
        } catch (e) {
            alert("오류 발생: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="mainContainer">
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL 입력"
            />
            <button onClick={handleSubmit} disabled={loading}>
                검색
            </button>

            <div id="resultContainer">
                <h2>요약 결과</h2>
                <h2 id="newsHead">[{head}]</h2>
                <div id="contentContainer" style={{ whiteSpace: "pre-wrap" }}>
                    {loading ? "요약 중..." : content}
                </div>
            </div>
        </div>
    );
}
