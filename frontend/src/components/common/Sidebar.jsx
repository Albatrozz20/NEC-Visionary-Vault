import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import logo from '../images/logo-bw.png';
import '../../index.css';
import './common.css';

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
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
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className=''>
			<nav className="navbar my-2 navbar-expand-lg">
      <div className="container d-flex gap-4">
        <img src={logo} alt="website logo" className="navLogo" />
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="roboto navbar-nav me-auto mb-2 mb-lg-0 d-flex gap-3">
            <div className="nav-item">
				<li className=''>
					<Link to='/' className='tdn t-dark'>
						<span className='t-dark links'>Home</span>
					</Link>
				</li>
            </div>
            <div className="nav-item">
				<li className=''>
					<Link to='/notifications' className='tdn t-dark'>
						<span className='t-dark links'>Notifications</span>
					</Link>
				</li>
            </div>
            <div className="nav-item">
				<li className=''>
					<Link to={`/profile/${authUser?.username}`} className='tdn t-dark'>
						<span className='t-dark links'>Profile</span>
					</Link>
				</li>
            </div>
          </ul>
        <div className="auth">
			{authUser && (
					<Link to={`/profile/${authUser.username}`} className='tdn roboto t-dark'>
						<div className="d-flex justify-content-between gap-2 align-items-center">
								<img className="profileImg rounded-full" src={authUser?.profileImg || "/avatar-placeholder.png"} />
								{/* <div className="d-flex flex-column">
									<p className=''>{authUser?.fullName}</p>
									<p className=''>@{authUser?.username}</p>
								</div> */}
								<h1 className='t-dark links logout' onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								>
									Logout
								</h1>
						</div>
					</Link>
				)}
		</div>
        </div>
      </div>
    </nav>
			<div className=''>
				<ul className='d-flex'>
				</ul>
				
			</div>
		</div>
	);
};
export default Sidebar;