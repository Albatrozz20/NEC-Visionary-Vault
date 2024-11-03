import { useState } from "react";
import { Link } from "react-router-dom";
import './loginPage.css'
import clgLogo from '../../../components/images/clgLogo.png';
import logo from '../../../components/images/logo.png';
import wave from '../../../components/images/wave-black.png';

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<>
			<img src={wave} alt="" className="wave-img" />
			<div className="imgs-container">
				<div className="imgs">
					<img className="clgLogo" src={clgLogo} alt="" />
				</div>
			<div className='login-content'>
				<form className='' onSubmit={handleSubmit}>
					<img src={logo} alt="" className="necvvLogo" id="necvvlogo"/>
					<br />
					<br />
					<h2 className='head-lib title'>NEC Visionary Vault</h2>
					<h2 className='sub-tri italic sub-title'>Welcome ~</h2>
					<div className="input-div one">
						<div className="i">
							<i className="fas fa-user"></i>
						</div>
						<div className="div">
							
							<input
								type='text'
								className='input'
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</div>
					</div>
					<div className="input-div pass">
						<div className="i"> 
							<i className="fas fa-lock"></i>
						</div>
						<div className="div">
							
							<input
								type='password'
								className='input'
								placeholder='Password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</div>
					</div>
					<button className='input btnss rounded'>
							{isPending ? "Loading..." : "Login"}
						</button>
						{isError && <p className='t-red'>{error.message}</p>}
			<div className='div d-flex justify-content-center align-items-center gap-2'>
					<p className='t-black'>Don`t have an account?</p>
					<Link to='/signup' className="">
						<button className='signupBtn rounded'>Sign up</button>
					</Link>
			</div>
            </form>
			</div>
		</div>
		</>
	);
};
export default LoginPage;
