import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import apiHelper from "../../../utils/api";

const Home = () => {
  const [docName, setDocName] = useState("");
  const [saveToDrive, setSaveToDrive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await apiHelper.get("/docs");
        setDocuments(res);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleSave = async () => {
    if (!docName.trim()) {
      alert("Please enter a document name.");
      return;
    }

    const payload = { name: docName, saveToDrive, content: {} };

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await apiHelper.post("/docs/create", payload);

      setDocName("");
      setSaveToDrive(false);

      navigate(`/dashboard/editor/${res.docId}`);
    } catch (error) {
      setErrorMessage(`Failed to create new document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start p-6">
      <h2 className="text-2xl font-semibold text-black mb-4">Recent Documents</h2>

      <div className="grid grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-center w-64 h-80 cursor-pointer transition-all duration-300 hover:bg-gray-600 group"
            onClick={() => navigate(`/dashboard/editor/${doc._id}`)}
          >
            <div className="flex flex-col items-center">
              <p className="text-gray-700 font-medium group-hover:text-white">
                {doc.name}
              </p>
            </div>
          </div>
        ))}

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-center w-64 h-80 cursor-pointer transition-all duration-300 hover:bg-gray-600 group">
              <div className="flex flex-col items-center">
                <Plus
                  size={24}
                  className="text-gray-600 mb-2 group-hover:text-white"
                />
                <p className="text-gray-700 font-medium group-hover:text-white">
                  Add New Document
                </p>
              </div>
            </div>
          </AlertDialog.Trigger>

          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none">
              <div className="text-xl text-black font-semibold mb-4">
                Create New Document
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
              )}

              <div className="relative mb-4">
                <label
                  htmlFor="docName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Document Name
                </label>
                <input
                  id="docName"
                  type="text"
                  placeholder="Enter document name"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="mt-1 block text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {docName && (
                  <button
                    type="button"
                    onClick={() => setDocName("")}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="saveToDrive"
                  checked={saveToDrive}
                  onChange={() => setSaveToDrive(!saveToDrive)}
                  className="w-4 h-4"
                />
                <label htmlFor="saveToDrive" className="text-gray-700">
                  Save to Google Drive
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <AlertDialog.Cancel asChild>
                  <button
                    disabled={loading}
                    className={`bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
};

export default Home;
