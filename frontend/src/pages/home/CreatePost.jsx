import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import './home.css'
    
const CreatePost = () => {

	const [text, setText] = useState("");
	const [desc, setDesc] = useState("");
	const [domain, setDomain] = useState("");
	const [gitLink, setGitLink] = useState("");
	const [hostLink, setHostLink] = useState("");
	const [img, setImg] = useState(null);
	const [vid, setVid] = useState(null);
	const imgRef = useRef(null);
	const vidRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, desc, domain, gitLink, hostLink, img, vid }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, desc, domain, gitLink, hostLink, img, vid }),
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
			setText("");
			setDesc("");
			setDomain("");
			setGitLink("");
			setHostLink("");
			setImg(null);
			setVid(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, desc, domain, gitLink, hostLink, img, vid });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleVidChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setVid(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

	return (
		<div className='d-flex overall-post-input p-2'>
			<div className='p-2'>
				<img className='profileContainer' src={authUser.profileImg || "/avatar-placeholder.png"} />
			</div>
			<form className='d-flex flex-column gap-2 p-2' onSubmit={handleSubmit}>
				<div className="d-flex flex-column text-input-area">
					<textarea
					className='textarea bg-white rounded m-2 p-1'
					placeholder='Project Title !'
					value={text}
					onChange={(e) => setText(e.target.value)}
					/>
					<textarea
					className='textarea bg-white rounded m-2 p-1'
					placeholder='Brief Description'
					value={desc}
					onChange={(f) => setDesc(f.target.value)}
					/>
					<textarea
					className='textarea bg-white rounded m-2 p-1'
					placeholder='Project Domain'
					value={domain}
					onChange={(f) => setDomain(f.target.value)}
					/>
					<textarea
					className='textarea bg-white rounded m-2 p-1'
					placeholder='GitHub Link'
					value={gitLink}
					onChange={(f) => setGitLink(f.target.value)}
					/>
					<textarea
					className='textarea bg-white rounded m-2 p-1'
					placeholder='Host Link (Optional)'
					value={hostLink}
					onChange={(f) => setHostLink(f.target.value)}
					/>
				</div>
				<div className='d-flex gap-2 justify-between border-t py-2 border-t-gray-700'>
					<div className="d-flex flex-column">
						<div className='d-flex gap-1 feedBtn align-items-center'>
							<button
								className='closeBtn rounded objUploadBtn'
								onClick={() => imgRef.current.click()}
							>
								Upload Output Image
							</button>
							<button
								className='closeBtn rounded objUploadBtn'
								onClick={() => vidRef.current.click()}
							>
								Upload Demo Video
							</button>
						</div>
					</div>
					
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<input type='file' accept='video/*' hidden ref={vidRef} onChange={handleVidChange} />
					
					<button className='uploadBtn postBtn rounded'>
						{isPending ? "Uploading..." : "Upload"}
					</button>
					
				</div>
				
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
			<div className="chooseFile d-flex gap-1 flex-column">
					{img && (
					<div className='file-div'>
						<IoCloseSharp
							className='close-cancel rounded'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='chooseFeed' />
					</div>
				)}
				
				{vid && (
					<div className='file-div'>
						<IoCloseSharp
							className='close-cancel rounded'
							onClick={() => {
								setVid(null);
								vidRef.current.value = null;
							}}
						/>
						<video src={vid} className='chooseFeed'></video>
						
					</div>
				)}

				</div>
		</div>
	);
};
export default CreatePost;
