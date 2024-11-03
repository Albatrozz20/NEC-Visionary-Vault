import { Link } from "react-router-dom";
import { useState } from "react";
import './signupPage.css'
import clgLogo from '../../../components/images/clgLogo.png';
import logo from '../../../components/images/logo.png';
import wave from '../../../components/images/wave-black.png';


import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");

			{
				/* Added this line below, after recording the video. I forgot to add this while recording, sorry, thx. */
			}
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
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
				<img src={logo} alt="" className="necvvLogo"/>
				<br />
				<br />
				<h2 className='head-lib title'>NEC Visionary Vault</h2>
				<h2 className='sub-tri italic sub-title'>Get Started ~</h2>
				<div className="input-div one">
					<div className="i">
						<i className="fas fa-user"></i>
					</div>
					<div className="div">
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</div>
				</div>
				<div className="input-div one">
					<div className="i">
						<i className="fas fa-user"></i>
					</div>
					<div className="div">
						<input
							type='text'
							className='grow '
							placeholder='Username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</div>
				</div>
				<div className="input-div one">
					<div className="i">
						<i className="fas fa-user"></i>
					</div>
					<div className="div">
						<input
							type='text'
							className='grow'
							placeholder='Full Name'
							name='fullName'
							onChange={handleInputChange}
							value={formData.fullName}
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
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</div>
				</div>
				<button className='input btnss rounded'>
					{isPending ? "Loading..." : "Sign up"}
				</button>
				{isError && <p className='t-red'>{error.message}</p>}
		<div className='div d-flex justify-content-center align-items-center gap-2'>
				<p className='t-black'>Already having an account?</p>
				<Link to='/login'>
						<button className='signupBtn rounded'>Sign in</button>
				</Link>
		</div>
		</form>
		</div>
	</div>
	</>
	);
};
export default SignUpPage;
