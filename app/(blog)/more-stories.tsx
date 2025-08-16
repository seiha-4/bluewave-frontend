import Link from "next/link";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";

import { sanityFetch } from "../../sanity/lib/fetch";
import { moreStoriesQuery } from "../../sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
}) {
  const data = await sanityFetch({ query: moreStoriesQuery, params });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {data?.map((post: any) => {
          const { _id, title, slug, coverImage, excerpt, author } = post;
          return (
            <article key={_id} className="card overflow-hidden group">
              <Link href={`/posts/${slug}`} className="block">
                <div className="aspect-video overflow-hidden rounded-t-xl mb-0">
                  <CoverImage image={coverImage} priority={false} />
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500">
                    <DateComponent dateString={post.date} />
                  </div>
                  <span className="bg-secondary-100 text-secondary-800 text-xs font-semibold px-2 py-1 rounded-full">
                    記事
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight text-gray-900 line-clamp-2">
                  <Link 
                    href={`/posts/${slug}`} 
                    className="hover:text-primary-600 transition-colors duration-200 group-hover:text-primary-600"
                  >
                    {title}
                  </Link>
                </h3>
                
                {excerpt && (
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                    {excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {author && (
                    <div className="flex items-center space-x-2">
                      <Avatar name={author.name} picture={author.picture} />
                      <span className="text-xs text-gray-500">{author.name}</span>
                    </div>
                  )}
                  <Link 
                    href={`/posts/${slug}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors duration-200 group-hover:translate-x-1 transform"
                  >
                    続きを読む →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
