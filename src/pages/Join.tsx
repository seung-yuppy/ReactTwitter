import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Button, Error, Form, Input, Switcher, Title, Wrapper } from "../styles/AuthComponents";

export default function Join() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return;
        try {
            setIsLoading(true);
            // create an account
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            // set the name of the user
            await updateProfile(credentials.user, { displayName: name });
            // redirect to the home page
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
                <Title>Join 𝕏</Title>
                <Form onSubmit={onSubmit}>
                    <Input name="name" value={name} placeholder="Name" type="text" onChange={onChange} required />
                    <Input name="email" value={email} placeholder="Email" type="email" onChange={onChange} required />
                    <Input name="password" value={password} placeholder="Password" type="password" onChange={onChange} required />
                    {isLoading ? <h2>Loading...</h2> : <Button type="submit">Submit</Button>}
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
                <Switcher>
                    Already have an account? <Link to="/login">Log In &rarr;</Link>
                </Switcher>
            </Wrapper>
        </>
    )
}