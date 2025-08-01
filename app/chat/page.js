"use client";

import { useState } from "react";

export default function ChatGPT() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ question: question })
            });

            const jsonData = await response.json();

            console.log("jsonData : ", jsonData);

            // ⁉️ 질문 실패 시
            if (response.status !== 200) {
                throw (
                    jsonData.error || new Error(`Request Failed with status ${respsone.status}`)
                );
            }

            // ⁉️ 질문 성공 시 answer를 응답 결과로 바꾸고 질문 폼 비우기 
            setAnswer(jsonData.result);
            setQuestion("");
        } catch (error) {
            console.log("error : ", error);
            alert(error.message);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button>전송</button>
            </form>

            <div>{answer}</div>
        </div>
    )
};