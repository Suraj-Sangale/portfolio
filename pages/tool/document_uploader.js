import React from "react";
import Layout from "@/components/layout";
import Header from "@/components/header";
import DocumentUploadSection from "@/components/DocumentUploadSection";
import Head from "next/head";

export default function DocumentUploaderTool() {
  return (
    <>
      <Head>
        <title>Document Uploader & Manager | Micro Tools</title>
        <meta
          name="description"
          content="Upload, rename, store, and manage files securely in the local public directory with drag-and-drop."
        />
      </Head>
      <Layout>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <DocumentUploadSection />
        </main>
      </Layout>
    </>
  );
}
