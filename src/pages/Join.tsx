import { useState } from "react";
import styled from "styled-components"

const Wrapper = styled.div`
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
width: 420px;
padding: 50px 0px;
`;

const Form = styled.form`
margin-top: 50px;
display: flex;
flex-direction: column;
gap: 10px;
width: 100%;
`;

const Title = styled.h1`
font-size: 42px;
`;

const Input = styled.input`
padding: 10px 20px;
border-radius: 50px;
border: none;
width: 100%;
font-size: 16px;
`;

const Error = styled.span`
font-weight: 600;
color: tomato;
`;

const Button = styled.button`
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    &:hover {
    opacity: 0.8;
    }
`;

export default function Join() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(name, email, password);
        try {
            // create an account

            // set the name of the user

            // redirect to the home page

            // initialize input
            setName("");
            setEmail("");
            setPassword("");
        } catch (e) {
            // setError
        } finally {
            setIsLoading(false);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value)
        }
    }

    return (
        <>
            <Wrapper>
                <Title>Join</Title>
                <Form onSubmit={onSubmit}>
                    <Input name="name" value={name} placeholder="Name" type="text" onChange={onChange} required />
                    <Input name="email" value={email} placeholder="Email" type="email" onChange={onChange} required />
                    <Input name="password" value={password} placeholder="Password" type="password" onChange={onChange} required />
                    {isLoading ? <h2>Loading...</h2> : <Button type="submit">Submit</Button>}
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
            </Wrapper>
        </>
    )
}