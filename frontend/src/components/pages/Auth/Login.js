import React from "react";
import { useState, useContext } from 'react';
import Input from '../../form/Input';
import styles from '../../form/Form.module.css';

//context
import { Context } from '../../../context/UserContext';
import { Link } from "react-router-dom";

function Login() {
    const [user, setUser] = useState({});
    const { login } = useContext(Context)

    function handleChande(e) {
        setUser({...user, [e.target.name]: e.target.value});//spread operator
    }

    function handleSubmit(e){
        e.preventDefault();
        login(user)
    }

    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail!"
                    handleOnChange={handleChande}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha!"
                    handleOnChange={handleChande}
                />
                <input type="submit" value="Login" />
            </form>
            <p>Não tem conta? <Link to="/register">Clique aqui.</Link></p>
        </section>
    );
}

export default Login;