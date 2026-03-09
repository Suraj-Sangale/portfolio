import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchTableData } from "@/utilities/services/supabaseService";
import { CommonTable } from "../common/commonTable";
import { pageBuilderHeadCells } from "@/utilities/Data";
import CommonModal from "../common/commonModal";
import PageDataForm from "./pageDataForm";
import { postApiData } from "@/utilities/services/apiService";

export default function PageBuilderWrapper() {
  const router = useRouter();
  const [pagesData, setPagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, today, week, month
  const [selected, setSelected] = useState([]);
  const [modalData, setModalData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [refreshRedisModal, setRefreshRedisModal] = useState(false);
  const [dataToRefresh, setDataToRefresh] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      fetchMessages();
    };

    checkAuthAndLoad();
  }, [router, filter]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    const response = await fetchTableData({
      tableName: "content_master",
      filterType: filter,
    });

    if (!response.success) {
      setError(response.error);
    } else {
      setPagesData(response.data);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("content_master")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Refresh pages
      fetchPages();
    } catch (err) {
      console.error("Error deleting page:", err);
      alert("Failed to delete page. Please try again.");
    }
  };

  if (loading && pagesData.length === 0) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pages...</p>
          </div>
        </div>
      </>
    );
  }
  const onClickEdit = async (id) => {
    const selectedItem = pagesData.find((item) => item.id == id);
    // {
    // "id": 1,
    // "created_at": "2026-03-03T03:08:58.367569+00:00",
    // "key_name": "portfolio:contact",
    // "content_json": {
    //     "heading": "Contact",
    //     "message": "Want to discuss a project or just say hi? My inbox is always open. 👋",
    //     "mainText": "Reach out",
    //     "subheading": "Contact",
    //     "highlightedText": "to me!"
    // }
    // }
    setModalData({
      id: selectedItem.id,
      key_name: selectedItem.key_name,
      content_json: selectedItem.content_json,
    });

    setDataModalOpen(true);
    setIsEdit(true);
  };
  const onClickRefreshRedis = async (data) => {
    setDataToRefresh(data);
    setRefreshRedisModal(true);
  };
  const handleRefreshRedisKey = async () => {
    // setRedis(dataToRefresh.key_name, dataToRefresh.content_json);
    const payload = {
      key: dataToRefresh.key_name,
      data: dataToRefresh.content_json,
    };
    const response = await postApiData("REFRESH_REDIS_KEY", payload);
  };

  const AddNewSection = () => {
    setDataModalOpen(true);
    setIsEdit(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pages Admin
                </h1>
                <p className="mt-2 text-gray-600">
                  Total pages: {pagesData.length}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="/dashboard"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Back to Dashboard
                </a>
                <button
                  onClick={AddNewSection}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add New
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {pagesData.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No messages found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <CommonTable
                rows={pagesData}
                headCells={pageBuilderHeadCells}
                onClickEdit={onClickEdit}
                selected={selected}
                setSelected={setSelected}
                onClickDelete={() => {}}
                isFilterApplied={false}
                searchTerm={""}
                onClickRefreshRedis={onClickRefreshRedis}
              />
            </div>
          )}
        </div>
      </div>

      <CommonModal
        modalTitle={isEdit ? "Edit Page Data" : "Add New Page Data"}
        modalOpen={dataModalOpen}
        setModalOpen={setDataModalOpen}
        modalSize={"w-11/12 md:w-4/6"}
      >
        <PageDataForm
          isEdit={isEdit}
          modalData={modalData}
          setDataModalOpen={setDataModalOpen}
          setPagesData={setPagesData}
          // setPagesList={setPagesList}
          // contactsList={contactsList}
        />
      </CommonModal>
      <CommonModal
        modalTitle={"Refresh Redis Cache"}
        modalOpen={refreshRedisModal}
        setModalOpen={setRefreshRedisModal}
        modalSize={"w-11/12 md:w-4/6"}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Are you sure you want to refresh the Redis cache for
            <span className="font-bold text-indigo-600">
              {" "}
              {dataToRefresh?.key_name}
            </span>
            ?
          </h2>
          <p className="text-gray-600 mb-4">
            This will clear the cache for the selected page and refresh it from
            the database.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setRefreshRedisModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                // Call your function to refresh Redis cache here
                handleRefreshRedisKey();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Refresh Cache
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
