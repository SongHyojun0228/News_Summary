"use client";

import { useState } from "react";
import Header from "../component/header";
import Footer from "../component/footer";

export default function HomePage() {
    const [url, setUrl] = useState("");
    const [content, setContent] = useState("");

    const handleScrape = async () => {
        const res = await fetch(`/api/crawling?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (data.error) {
            alert("크롤링 실패!!!! :  " + data.error);
            return;
        }
        setContent(data.content);
    };

    return (
        <div id="mainContainer"> 
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL 입력"
            />
            <button onClick={handleScrape}>
                검색
            </button>
            <div id="resultContainer">
                <h2>요약 결과</h2>
                <div id="contentContainer">
                    {content}
                </div>
            </div>
        </div>
    );
}
