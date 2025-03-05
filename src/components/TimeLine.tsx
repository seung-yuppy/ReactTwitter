import { useEffect, useState } from "react"
import { ITweet } from "../types/ITweet"
import styled from "styled-components";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Tweets from "./Tweets";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default function TimeLine() {
    const [tweets, setTweets] = useState<ITweet[]>([]);

    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "tweets"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map((doc) => {
            // 파이어베이스에서 필요한 필드들을 추출함
            const { tweet, createdAt, userId, username, photo } = doc.data();
            // 새로운객체를 생성하여 반환함
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id,
            };
        });
        setTweets(tweets);
    };

    useEffect(() => {
        fetchTweets();
    }, [])

    return (
        <>
            <Wrapper>
                {tweets.map((tweet) => (
                    // 트위터 배열 중 한 트윗의 모든 props를 Tweets 컴포넌트에 전달한다
                    <Tweets key={tweet.id} {...tweet} />
                ))}
            </Wrapper>
        </>
    )

}