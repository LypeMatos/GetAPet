import { useState, useContext } from "react";
import React from "react";
import Input from '../../form/Input';
import {Link} from 'react-router-dom';
import styles from '../../form/Form.module.css';
import MaskedInput from '../../form/inputMask.js';

//context
import {Context} from '../../../context/UserContext';

function Register() {
    const [user, setUser] = useState({});
    const {register} = useContext(Context)

    function handleChange(e){
        let phoneTest = user.phone;
        let phoneAux = phoneTest.replace(/[^0-9]/g, '');
        user.phone = phoneAux;
        setUser({...user, [e.target.name]: e.target.value});        
    }

    function handleSubmit(e){
        e.preventDefault();
        //enviar o usuario para o banco
        register(user);
    }

    return(
        <section className={styles.form_container}>
            <h1>Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <Input text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChange}
                />
                <MaskedInput
                    mask="(99) 99999-9999"
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChange}
                />
                <Input text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnChange={handleChange}
                />
                <Input text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleChange}
                />
                <Input text="Confirmação de senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Cadastrar"/>
            </form>
            <p>
                Já possui uma conta? <Link to="/login">Clique aqui.</Link>
            </p>
        </section>
    );    
}

export default Register;