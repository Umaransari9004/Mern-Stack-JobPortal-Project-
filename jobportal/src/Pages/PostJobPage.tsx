import { Divider } from '@mantine/core';
import React from 'react'
import PostJob from '../Components/PostJob/PostJob.tsx';

const PostJobPage = () => {
    return (
        <div className="min-h-[90vh] bg-white font-['poppins'] p-4">
          <PostJob/>
        </div>
      )
}

export default PostJobPage;
