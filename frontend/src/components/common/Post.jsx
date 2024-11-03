import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import './common.css'
// import axios from 'axios';
// import { saveAs } from 'file-saver';

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import { formatPostYear } from "../../utils/date";
 
const Post = ({ post }) => {

	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);
	const formatYear = formatPostYear(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
		
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};
	const [isVisible, setIsVisible] = useState(false);
	const openUpload = () => {
		setIsVisible(true);
	};
	
	const closeUpload = () => {
		setIsVisible(false);
	};

	const date = new Date(post.user.createdAt);
	const projectYear = date.getFullYear();
	const projectMonth = date.toLocaleDateString('en-US', { month: 'long' });


	//git download code inga venum
	function DownloadButton({ gitLink }) {
		// Construct the ZIP download URL based on the provided GitHub link
		const getZipDownloadLink = () => {
		return `${gitLink}/archive/refs/heads/main.zip`;
		};
		return (
		<button
			onClick={() => {
			// Trigger the download
			window.location.href = getZipDownloadLink();
			}}
		>
		Download ZIP
		</button>
		);
	}
  





	return (
		<>
			<div className='d-flex gap-2 align-items-start p-4 project-container'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='side-profile'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='d-flex flex-column'> {/* class name = flex-1*/}
					<div className='d-flex gap-2 align-items-center'>
						<Link to={`/profile/${postOwner.username}`} className='fw-bold text-decoration-none text-secondary'>
							{postOwner.fullName}
						</Link>
						<span className='uname d-flex gap-1'>
							<Link className="fw-medium text-decoration-none text-secondary" to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span className="">{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='d-flex justify-content-end w-100 flex-1'>
								{!isDeleting && (
									<FaTrash className='delete-icon' onClick={handleDeletePost} />
								)}

								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>
					<div className='d-flex flex-column gap-3 overflow-hidden'>
						<div className="d-flex flex-column">
							<span className="fw-bold ti">Title: {post.text}</span>
							<span className="fw-bold text-secondary do">Domain: {post.domain}, {formatYear}</span>
						</div>
						{post.img && (
							<img
								src={post.img}
								className='post-img rounded border'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='d-flex gap-4 align-items-center w-100 justify-content-between'>
							<div
								className='d-flex gap-1 align-items-center flex items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box bg-slate-50 rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 bg-slate-50 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn closeBtn rounded btn-sm text-white px-4'>
											{isCommenting ? <LoadingSpinner size='md' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='d-flex gap-1 align-items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
								)}

								<span
									className={`text-sm  group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
								
							</div>
							<button className="closeBtn rounded" onClick={openUpload}>
								View Project
							</button>
							{isVisible && (
								<div className="view-project-container" >
									<div className="view-project d-flex justify-content-end p-3 rounded">
										<button className="rounded detail-close" onClick={closeUpload}>X</button>
									</div>
									<div className="project-detail-container">
										<div className="container-fluid row display-out-container">
											<div className="col-lg-4">
												<div className="display-img">
													<img className="display-img-out" src={post.img} alt="" />
												</div>
												<br />
												<div className="display-vid">
												<video className="display-vid-out" controls>
													<source src={post.vid} type="video/mp4" />
												</video>
												</div>
											</div>
											<div className="col-lg-8 display-det">
												<h2 className="text-5xl py-2"><b>Title: {post.text}</b></h2>
												<h2 className="text-2xl pb-4"><i><b>Domain:</b> {post.domain},</i> {projectMonth} {projectYear}</h2>
												<h2 className="text-2xl"><b>Author:</b> {post.user.fullName}</h2>
												<h2 className="text-2xl"><b>Mail:</b> {post.user.email}</h2>
												<h2 className="text-2xl"><b>Description:</b> {post.desc}</h2>
												<div className="py-3 flex gap-2 flex-wrap"><a className="rounded gitlinkBtn" href={post.gitLink} target="_blank">Go to Repository</a> <button className="rounded gitlinkBtn"><DownloadButton gitLink={post.gitLink} /></button></div>
												<h2>{post.hostLink}</h2>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>

					</div>
				</div>
			</div>
		</>
	);
};
export default Post;
