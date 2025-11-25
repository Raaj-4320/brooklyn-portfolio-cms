import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';
import { X, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const { content, isEditing } = useContent();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 4;
  const totalPages = Math.ceil(content.blog.posts.length / postsPerPage);

  const handlePostClick = (post: any) => {
      if (isEditing) return;
      setSelectedPost(post);
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const currentPosts = content.blog.posts.slice(
    currentPage * postsPerPage, 
    (currentPage + 1) * postsPerPage
  );

  return (
    <section id="blog" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <EditableText section="blog" path="title" value={content.blog.title} />
          </h2>
          <div className="text-gray-500">
             <EditableText section="blog" path="subtitle" value={content.blog.subtitle} multiline />
          </div>
        </div>

        {/* Blog Grid / Carousel View */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px] transition-all duration-300">
          {currentPosts.map((post, index) => {
            // Calculate actual index in the main array for editing
            const realIndex = currentPage * postsPerPage + index;
            
            return (
              <div key={post.id} className="group cursor-pointer flex flex-col h-full" onClick={() => handlePostClick(post)}>
                <div className="rounded-xl overflow-hidden mb-4 h-48 relative shadow-md">
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                   <EditableImage 
                      section="blog" 
                      path={['posts', realIndex, 'image']} 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                   />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                   <Calendar size={12} />
                   <EditableText section="blog" path={['posts', realIndex, 'date']} value={post.date} as="span" />
                   <span className="mx-1">/</span>
                   <MessageSquare size={12} />
                   <span>{post.comments} <EditableText section="blog" path="commentsLabel" value={content.blog.commentsLabel} as="span" /></span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors leading-snug mb-2">
                   <EditableText section="blog" path={['posts', realIndex, 'title']} value={post.title} multiline />
                </h3>
                {!isEditing && (
                  <div className="mt-auto pt-2 text-sm font-semibold text-violet-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Carousel Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentPage === idx ? 'w-8 h-2 bg-violet-600' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Read More Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPost(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-200">
            
            {/* High Contrast Close Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 bg-white text-gray-900 hover:bg-gray-100 rounded-full shadow-xl transition-all z-20 border border-gray-200 hover:scale-105"
              title="Close"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="h-64 md:h-80 w-full relative">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="flex items-center gap-3 text-sm mb-2 opacity-90">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {selectedPost.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14}/> {selectedPost.comments} Comments</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">{selectedPost.title}</h2>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
               <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                 {selectedPost.body ? (
                   selectedPost.body.split('\n').map((paragraph: string, i: number) => (
                     <p key={i} className="mb-4">{paragraph}</p>
                   ))
                 ) : (
                   <p className="italic text-gray-400">No content available for this post yet.</p>
                 )}
               </div>
               
               <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => setSelectedPost(null)} className="text-gray-700 font-bold hover:text-red-600 transition-colors flex items-center gap-2">
                    <X size={16} /> Close Article
                  </button>
                  <button className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                    Share Post
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;