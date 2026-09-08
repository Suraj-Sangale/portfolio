import React from "react";
import Layout from "@/components/layout";
import Header from "@/components/header";
import DocumentUploadSection from "@/components/DocumentUploadSection";
import Head from "next/head";

export default function DocumentsPage() {
  return (
    <>
      <Head>
        <title>Document Center & Upload | Portfolio</title>
        <meta
          name="description"
          content="Upload, rename, manage, and store documents with drag-and-drop support, duplicate protection, and secure local storage."
        />
      </Head>
      {/* <Layout> */}
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <DocumentUploadSection />
        </main>
      {/* </Layout> */}
    </>
  );
}
