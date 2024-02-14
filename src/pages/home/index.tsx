import { useContext, useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";

export interface PostProps {
    id: string;
    email: string;
    content: string;
    createdAt: string;
    uid: string;
    profileUrl?: string;
    likes?: string[];
    likeCount?: number;
    comments?: any;
    hashTags?: string[];
    imageUrl?: string;
}

export default function HomePage() {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(user) {
            let postRef = collection(db, "posts"); //firestore에 posts 컬렉션을 가져와!
            let postQuer = query(postRef, orderBy("createdAt", "desc"));

            onSnapshot(postQuer, (snapShot) => {
                let dataObj = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }));
                // console.log(dataObj);
                setPosts(dataObj as PostProps[]);
            });
        }
    }, [user]);

    return (
        <div className="home">
            <div className="home__top">
                <div className="home__title">Home</div>
                <div className="home__tabs">
                    <div className="home__tab home__tab--active">For You</div>
                    <div className="home__tab">Following</div>
                </div>
        </div>

            {/* Post Form */}
            <PostForm />

            {/* Tweet Posts */}
            <div className="post">
                {posts?.length > 0 ? posts?.map((post) => (
                    <PostBox post={post} key={post.id} />
                )) : (
                    <div className="post__no-posts">
                        <div className="post__text">게시글이 없습니다.</div>
                    </div>
                )}
            </div>
        </div>
    );
}