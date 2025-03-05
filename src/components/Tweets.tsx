import styled from "styled-components";
import { ITweet } from "../types/ITweet";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3.5fr 2fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 200px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  padding: 10px 0;
`;

// Tweets 컴포넌트에서는 username, photo, tweet, createdAt만을 사용할거임
export default function Tweets({ username, photo, tweet, createdAt }: ITweet) {
    return (
        <>
            <Wrapper>
                <Column>
                    <Username>{username}</Username>
                    <Payload>{tweet}</Payload>
                    <Username>만든 시각 :{createdAt}</Username>
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