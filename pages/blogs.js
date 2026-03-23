import Layout from "@/components/layout";
import Blogs from "@/components/blogs";
import { useTrackPageActivity } from "@/hooks/useTrackPageActivity";

export default function BlogsPage() {
  useTrackPageActivity("blogs");

  return (
    <Layout>
      <Blogs />
    </Layout>
  );
}

