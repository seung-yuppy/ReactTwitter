import styled from "styled-components";
import { ITweet } from "../types/ITweet";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3.5fr 2fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
`;

const Photo = styled.img`
  width: 200px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  display: block;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  padding: 10px 0;
`;

const DeleteBtn = styled.button`
  background-color: crimson;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

// Tweets 컴포넌트에서는 username, photo, tweet, createdAt만을 사용할거임
export default function Tweet({ username, photo, tweet, createdAt, userId, id }: ITweet) {
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) {
      return;
    };
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`)
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.error("삭제에러", error);
    }
  }

  return (
    <>
      <Wrapper>
        <Column>
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
          <Username>만든 시각 :{createdAt}</Username>
          {user?.uid === userId ? <DeleteBtn onClick={onDelete}>Delete</DeleteBtn> : null}
        </Column>
        {photo ?
          <Column>
            <Photo src={photo} alt="No-Image" />
          </Column>
          : null}
      </Wrapper>
    </>
  )
}