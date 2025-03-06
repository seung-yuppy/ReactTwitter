import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Button, Error, Form, Input, Switcher, Title, Wrapper } from "../styles/AuthComponents";
import GitHubButton from "../components/GithubButton";

export default function LogIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "") return;
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (e) {
            // setError
            console.log(e);
            if (e instanceof FirebaseError) {
                console.log(e.code, e.message);
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value)
        }
    }

    return (
        <>
            <Wrapper>
                <Title>Log In 𝕏</Title>
                <Form onSubmit={onSubmit}>
                    <Input name="email" value={email} placeholder="Email" type="email" onChange={onChange} required />
                    <Input name="password" value={password} placeholder="Password" type="password" onChange={onChange} required />
                    {isLoading ? <h2>Loading...</h2> : <Button type="submit">Submit</Button>}
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
                <Switcher>
                    Don't have an account? <Link to="/join">Create one &rarr;</Link>
                </Switcher>
                <GitHubButton />
            </Wrapper>
        </>
    )
}