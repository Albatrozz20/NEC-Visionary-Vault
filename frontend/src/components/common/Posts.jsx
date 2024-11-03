import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState} from "react";
import './common.css';

const Posts = ({ feedType, username, userId }) => {
	const [search, setSearch] = useState("");
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);
	const filteredPost = posts?.filter(post => 
		post.text?.toLowerCase().includes(search.toLowerCase()) ||
		post.domain?.toLowerCase().includes(search.toLowerCase()) ||
		post.user.username?.toLowerCase().includes(search.toLowerCase()) ||
		post.user.fullName?.toLowerCase().includes(search.toLowerCase()))

	return (
		<>
			<div className="search-bar d-flex justify-center gap-2 align-items-center text-center m-3">
				<input
					type="text"
					placeholder="Search here !"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="search-input px-3 p-1 rounded bg-white"
				/>
				<button className="closeBtn rounded">Search</button>
			</div>

			{(isLoading || isRefetching) && (
				<div className='flex post-skel justify-center'>{/*flex-col */}
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && filteredPost?.length === 0 && (
				<p className='text-center my-4'>No projects in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && filteredPost && (
				<div className="post-pattern">
					{filteredPost.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;
