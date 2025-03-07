import { useEffect, useState } from "react"
import { ITweet } from "../types/ITweet"
import styled from "styled-components";
import { collection, DocumentData, limit, onSnapshot, orderBy, query, QueryDocumentSnapshot, QuerySnapshot, startAfter } from "firebase/firestore";
import { db } from "../firebase";
import Tweets from "./Tweets";
import { Unsubscribe } from "firebase/auth";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default function TimeLine() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(3),
            );

            // 실시간 처리가 아님!
            // const snapshot = await getDocs(tweetsQuery);
            // const tweets = snapshot.docs.map((doc) => {
            //     // 파이어베이스에서 필요한 필드들을 추출함
            //     const { tweet, createdAt, userId, username, photo } = doc.data();
            //     // 새로운객체를 생성하여 반환함
            //     return {
            //         tweet,
            //         createdAt,
            //         userId,
            //         username,
            //         photo,
            //         id: doc.id,
            //     };
            // });

            // 실시간 처리!
            // onSnapshot-- > 이벤트 리스너를 연결시킨다
            unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
                handleSnapshot(snapshot);
                setLoading(false);
            });
        };

        fetchTweets();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const handleSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
        const newTweets = snapshot.docs.map((doc) => {
            const { tweet, createdAt, userId, username, photo } = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id,
            };
        });

        setTweets(newTweets);
        if (snapshot.docs.length > 0) {
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }
        setHasMore(snapshot.docs.length === 3);
    };

    const fetchNextPage = async () => {
        if (!lastVisible || loading || !hasMore) return;
        setLoading(true);
        const nextTweetsQuery = query(
            collection(db, "tweets"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(3)
        );

        await onSnapshot(nextTweetsQuery, (snapshot) => {
            const newTweets = snapshot.docs.map((doc) => {
                const { tweet, createdAt, userId, username, photo } = doc.data();
                return {
                    tweet,
                    createdAt,
                    userId,
                    username,
                    photo,
                    id: doc.id,
                };
            });
            setTweets((prevTweets) => [...prevTweets, ...newTweets]);
            if (snapshot.docs.length > 0) {
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            }
            setHasMore(snapshot.docs.length === 3);
            setLoading(false);
        });
    };

    return (
        <>
            <Wrapper>
                {tweets.map((tweet) => (
                    <Tweets key={tweet.id} {...tweet} />
                ))}
                {loading && <div>Loading...</div>}
                {hasMore && <button onClick={fetchNextPage}>Load More</button>}
            </Wrapper>
        </>
    );
}