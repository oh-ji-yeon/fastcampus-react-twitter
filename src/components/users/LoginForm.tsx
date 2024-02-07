import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";


export default function LoginForm() {
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const onSubmit = async(e: any) => {
        e.preventDefault();

        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
            toast.success("성공적으로 로그인 되었습니다!");
        } catch(error: any) {
            toast.error(error?.code);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {name, value}
        } = e;
        // console.log(name, value);

        if(name === "email") {
            setEmail(value);
            const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if(!value?.match(validRegex)) {
                setError("이메일 형식이 올바르지 않습니다.");
            } else {
                setError("");
            }
        }

        if(name === "password") {
            setPassword(value);

            if(value?.length < 8) {
                setError("비밀번호는 8자리 이상 입력해주세요.")
            } else {
                setError("");
            }
        }
    };

    return (
        <form className="form form--lg" onSubmit={onSubmit}>
            <div className="form__title">로그인</div>
            <div className="form__block">
                <label htmlFor="email">email</label>
                <input type="text" name="email" id="email" value={email} required onChange={onChange} />
            </div>
            <div className="form__block">
                <label htmlFor="password">password</label>
                <input type="password" name="password" id="password" value={password} required onChange={onChange} />
            </div>
            {/* 만약 에러가 있다면? 해당 에러를 보여줘! */}
            {error && error?.length > 0 && (
                <div className="form__block">
                    <div className="form__error">{error}</div>
                </div>
            )}
            
            <div className="form__block">
                계정이 없으신가요?
                <Link to="/users/sigin" className="form__link">로그인하기</Link>
            </div>
            <div className="form__block--lg">
                <button type="submit" className="form__btn--submit" disabled={error?.length > 0}>로그인</button>
            </div>
        </form>
    );
}