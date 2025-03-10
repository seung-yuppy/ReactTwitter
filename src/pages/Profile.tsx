import styled from "styled-components";
import { auth, db, storage } from "../firebase"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../types/ITweet";
import Tweet from "../components/Tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
    display:flex;
    flex-direction: column;
    gap: 10px;
`

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([])

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { files } = e.target;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            if (file.size < 1 * 1024 * 1024) {
                const locationRef = ref(storage, `avatars/${user?.uid}`)
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                setAvatar(url);
                await updateProfile(user, {
                    photoURL: url,
                });
            }
        }
    };

    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(10)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map((doc) => {
            const { tweet, createdAt, userId, username, photo } = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id
            }
        });
        setTweets(tweets);
    }

    useEffect(() => {
        fetchTweets();
    }, [])

    return (
        <>
            <Wrapper>
                <AvatarUpload htmlFor="avatar">
                    {avatar ? <AvatarImg src={avatar} />
                        : (
                            <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                        )}
                </AvatarUpload>
                <AvatarInput
                    type="file"
                    onChange={onAvatarChange}
                    id="avatar"
                    accept="image/*"
                />
                <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name>
                <Tweets>
                    {tweets.map((tweet) => (
                        <Tweet key={tweet.id} {...tweet} />
                    ))}
                </Tweets>
            </Wrapper>
        </>
    )
}